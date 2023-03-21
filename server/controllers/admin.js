const BookedTimeSlot = require('../models/BookedTimeSlot')
const ParkingLot = require('../models/ParkingLot')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const dayjs = require('dayjs')
const { latLonValidator } = require('../validators/joi-validator')
const sendEmail = require('../Utils/sendEmail')

exports.createAdmin = async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('admin123', salt)
    const newUser = await User.create({
        email: 'smartparking678@gmail.com', password: hashedPassword,
        firstName: 'Smart', lastName: 'Parker',
        userName: 'smparker', mobileNo: '9702063963',
        createdAt: new Date().toISOString(),
        verified: true,
        otp: '123',
        role: 'admin'
    })
    return res.status(200).json({ msg: "Admin created" })
}
exports.getUsersName = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try {
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }

        var users = await User.find({role:"user"}, { firstName: 1, lastName: 1 })
        users = users.map(user => ({ _id: user._id, name: user.firstName + " " + user.lastName }))
        console.log(users)
        return res.status(200).json({ msg: "Users List returned", usersName: users })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}

exports.getUserHistory = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try {
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }

        var bookedTimeSlots = await BookedTimeSlot.find({
            booker: req.query._id
        })
        if (bookedTimeSlots.length == 0) {
            return res.status(200).json({ msg: "Booked slots returned for user", bookedTimeSlots: bookedTimeSlots })
        }
        const slotIds = []
        for (let slot of bookedTimeSlots) {
            if (!slotIds.includes(slot.parkingLot)) {
                slotIds.push(slot.parkingLot)
            }
        }
        var parkingLots = await ParkingLot.find({
            _id: {
                $in: slotIds
            }
        })
        var parkingLotMap = {}
        parkingLots = parkingLots.map((lot) => {
            parkingLotMap[lot._id] = lot
            return { _id: lot._id, name: lot.name, address: lot.address, location: lot.location.coordinates, parkingChargesBike: lot.parkingChargesBike, parkingChargesCar: lot.parkingChargesCar }
        })


        console.log(parkingLots)
        console.log(parkingLotMap)


        console.log(bookedTimeSlots)
        bookedTimeSlots = bookedTimeSlots.map(timeSlot => {
            // {...timeSlot,charges:((timeSlot.endTime-timeSlot.startTime)/1000*60*60)*timeSlot.parkingLot.}
            if (timeSlot.vehicleType == "Bike") {
                const charges = ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLotMap[timeSlot.parkingLot].parkingChargesBike
                return { ...timeSlot._doc, parkingLot: parkingLotMap[timeSlot.parkingLot], charges: charges }
            } else {
                const charges = ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLotMap[timeSlot.parkingLot].parkingChargesCar
                return { ...timeSlot._doc, parkingLot: parkingLotMap[timeSlot.parkingLot], charges: charges }
            }
        })
        console.log(bookedTimeSlots)
        return res.status(200).json({ msg: "Booked slots returned for user", bookedTimeSlots: bookedTimeSlots })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}

exports.getParkingLotsNear = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try {
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }

        const { error } = latLonValidator.validate(req.query)
        if (error) {
            return res.status(400).json({ msg: error.details[0].message })
        }

        const { lat, lng } = req.query

        var parkingLots = await ParkingLot.aggregate([

            {
                $geoNear: {
                    "near": {
                        "type": "Point",
                        "coordinates": [lat, lng]
                    },
                    "distanceField": "distance",
                    "spherical": true,
                    "maxDistance": 2000
                },
            }
        ])

        parkingLots = parkingLots.map(lot => ({ name: lot.name }))

        return res.status(200).json({ msg: "ParkingLots near location returned", parkingLots: parkingLots })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}


exports.getParkingLots = async (req, res) => {
    console.log("Here")
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try {
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }

        var parkingLots = await ParkingLot.find({}, { name: 1,isActive:1 });

        parkingLots = parkingLots.map(lot => lot._doc)

        return res.status(200).json({ msg: "ParkingLots returned", parkingLots: parkingLots })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}

exports.getParkingLotHistory = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try {
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }

        var bookedTimeSlots = await BookedTimeSlot.find({
            parkingLot: req.query._id
        })

        const parkingLot = await ParkingLot.findById(req.query._id)
        console.log(parkingLot)
        if (bookedTimeSlots.length == 0) {
            return res.status(200).json({ msg: "Booked slots history returned for parking lot", bookedTimeSlots: bookedTimeSlots, parkingLotDetails: parkingLot })
        }

        const userIds = []
        for (var slot of bookedTimeSlots) {
            if (!userIds.includes(slot.booker)) {
                userIds.push(slot.booker)
            }
        }

        var users = await User.find({
            _id: {
                $in: userIds
            }

        }, {
            firstName: 1, lastName: 1
        })
        console.log(userIds)
        console.log(users)
        var userMap = {}
        for (let user of users) {
            userMap[user._id] = { _id: user._id, name: user.firstName + " " + user.lastName }
        }
        console.log(userMap)
        bookedTimeSlots = bookedTimeSlots.map(timeSlot => {
            // {...timeSlot,charges:((timeSlot.endTime-timeSlot.startTime)/1000*60*60)*timeSlot.parkingLot.}
            if (timeSlot.vehicleType == "Bike") {
                const charges = ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesBike
                return { ...timeSlot._doc, charges: charges, booker: userMap[timeSlot.booker] }
            } else {
                const charges = ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesCar
                return { ...timeSlot._doc, charges: charges, booker: userMap[timeSlot.booker] }
            }
        })
        console.log(bookedTimeSlots)

        return res.status(200).json({ msg: "Parking lots returned", bookedTimeSlots: bookedTimeSlots, parkingLotDetails: parkingLot })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}


exports.deleteParkingLot = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try {
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }
        console.log(req.body)
        if (!req.body.id) {
            return res.status(400).json({ msg: "Please pass Parking Lot ID" })
        }
        const parkingLot = await ParkingLot.findById(req.body.id)
        console.log(parkingLot.name, parkingLot.parkingChargesBike)
        const updatedLot = await ParkingLot.findByIdAndUpdate(req.body.id,{isActive:false},{new:true})
        console.log(updatedLot)

        //finding the active timeslots booked
        const bookedTimeSlots = await BookedTimeSlot.find({
            parkingLot: req.body.id,
            startTime: {
                $gte: Date.now()
            },
            cancelled:false
        }, {
            booker: 1, startTime: 1, endTime: 1, vehicleType: 1
        })

        const userIds = bookedTimeSlots.map(slot => slot.booker)
        console.log(userIds)
        var users = await User.find({
            _id: {
                $in: userIds
            }
        }, {
            firstName: 1, lastName: 1, email: 1
        })
        var userMap = {}
        for (let user of users) {
            userMap[user._id] = { _id: user._id, name: user.firstName + " " + user.lastName, email: user.email }
        }
        console.log(users)
        for (let ts of bookedTimeSlots) {
            const subject = "[Smart Parker] Booking Cancellation"
            
            const receiverMail = userMap[ts.booker].email

            if (ts.vehicleType === "Bike") {
                const charges = ((ts.endTime - ts.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesBike
                const html = `
                    <div
                    class="container"
                    style="max-width: 90%; margin: auto; padding-top: 20px"
                >
                    Dear ${userMap[ts.booker].name}, 
                    We are sorry to inform you that due to some issues your parking booking for a <b>Bike</b> at <b>${parkingLot.name}</b> between <b>${dayjs(ts.startTime)}</b> and <b>${dayjs(ts.endTime)}</b> has been cancelled. 
                    The charges for this parking you booked <b>${charges}</b>, will be refunded to your account within 2 days
                    </div>
                `
                sendEmail({html,subject,receiverMail})
                await BookedTimeSlot.findByIdAndUpdate(ts._id,{cancelled:true,adminCancelled:true,cancelledAt:Date.now()})
                // console.log(`Dear ${userMap[ts.booker].name}, We are sorry to inform you that due to some issues your parking booking for a Bike at ${parkingLot.name} between ${dayjs(ts.startTime)} and ${dayjs(ts.endTime)} has been cancelled. The charges for this parking you booked ${charges}, will be refunded to your account within 2 days`)
            } else {
                const charges = ((ts.endTime - ts.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesCar
                const html = `
                    <div
                    class="container"
                    style="max-width: 90%; margin: auto; padding-top: 20px"
                >
                    Dear ${userMap[ts.booker].name}, 
                    We are sorry to inform you that due to some issues your parking booking for a <b>Bike</b> at <b>${parkingLot.name}</b> between <b>${dayjs(ts.startTime)}</b> and <b>${dayjs(ts.endTime)}</b> has been cancelled. 
                    The charges for this parking you booked <b>${charges}</b>, will be refunded to your account within 2 days
                    </div>
                `
                sendEmail({html,subject,receiverMail})
                await BookedTimeSlot.findByIdAndUpdate(ts._id,{cancelled:true,adminCancelled:true,cancelledAt:Date.now()})
                // console.log(`Dear ${userMap[ts.booker].name}, We are sorry to inform you that due to some issues your parking booking for a Car at ${parkingLot.name} between ${dayjs(ts.startTime)} and ${dayjs(ts.endTime)} has been cancelled. The charges for this parking you booked ${charges}, will be refunded to your account within 2 days`)
            }

        }
        
        console.log(bookedTimeSlots)

        return res.status(200).json({ msg: "Parking Lot Made Inactive" })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.makeActiveParkingLot = async(req,res)=>{
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try{
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }
        console.log(req.body)
        await ParkingLot.findByIdAndUpdate(req.body.id,{isActive:true})
        return res.status(200).json({msg: "Parking Lot Active Again"})
    }catch(err){
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.getCancelledSlots = async(req,res)=>{
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try{
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }
        console.log(req.body)
        
        var cancelledTimeSlots = await BookedTimeSlot.find({
            cancelled:true
        })
        console.log(cancelledTimeSlots)

        const userIds = []
        const lotIds = []
        for (var slot of cancelledTimeSlots) {
            if (!userIds.includes(slot.booker)) {
                userIds.push(slot.booker)
            }
            if(!lotIds.includes(slot.parkingLot)){
                lotIds.push(slot.parkingLot)
            }
        }

        console.log(userIds)
        console.log(lotIds)

        var users = await User.find({
            _id: {
                $in: userIds
            }

        }, {
            firstName: 1, lastName: 1,email:1
        })

        var parkingLots = await ParkingLot.find({
            _id: {
                $in: lotIds
            }
        },
        {
            name:1,parkingChargesBike:1,parkingChargesCar:1
        })

        console.log(parkingLots)

        var userMap = {}
        for (let user of users) {
            userMap[user._id] = { _id: user._id,  name:user.firstName + " " + user.lastName, email: user.email }
        }

        var parkingLotMap = {}
        for(let lot of parkingLots){
            parkingLotMap[lot._id] = lot
        }

        console.log(userMap,parkingLotMap)
        

        cancelledTimeSlots= cancelledTimeSlots.map(slot=>(
            slot.vehicleType==="Bike"?(
                {...slot._doc,charges:((slot.endTime - slot.startTime) / (1000 * 60 * 60))*parkingLotMap[slot.parkingLot].parkingChargesBike,
                booker:userMap[slot.booker],parkingLot:parkingLotMap[slot.parkingLot]}):
            ({...slot._doc,charges:((slot.endTime - slot.startTime) / (1000 * 60 * 60))*parkingLotMap[slot.parkingLot].parkingChargesCar,
            booker:userMap[slot.booker],parkingLot:parkingLotMap[slot.parkingLot]})
        ))

        console.log(cancelledTimeSlots)

        return res.status(200).json({msg:"Cancelled slots returned",cancelledSlots:cancelledTimeSlots})
    }catch(err){
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}