const BookedTimeSlot = require('../models/BookedTimeSlot')
const ParkingLot = require('../models/ParkingLot')
const User = require('../models/User')
const dayjs = require('dayjs')
const passwordHash = require('password-hash')
const { latLonValidator } = require('../validators/joi-validator')
const sendEmail = require('../Utils/sendEmail')
const sendEmail2 = require('../Utils/sendEmail2')

//query to craete an admin not accessible from frontend
//but one can query using postman to create a new admin
exports.createAdmin = async (req, res) => {
    // const salt = await bcrypt.genSalt(10)
    const hashedPassword = passwordHash.generate('admin123')
    // const hashedPassword = await bcrypt.hash('admin123', salt)
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


//tested
/*get list of all the users registered on the system*/
exports.getUsersName = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try {
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        //check if user making request is an admin
        if (reqUser.role !== "admin") {
            return res.status(401).json({ msg: "Unauthorized" })
        }

        //get List of all user's firstName and lastName
        var users = await User.find({role:"user"}, { firstName: 1, lastName: 1 })

        //send name concatenating both firstName and lastName
        users = users.map(user => ({ _id: user._id, name: user.firstName + " " + user.lastName }))
        

        return res.status(200).json({ msg: "Users List returned", usersName: users })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}

//tested
/*get all of slots booked by a particular user*/
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


        //get all of slots booked by user
        var bookedTimeSlots = await BookedTimeSlot.find({
            booker: req.query._id,
            paid:true
        })
        //if no slots return directly
        if (bookedTimeSlots.length == 0) {
            return res.status(200).json({ msg: "Booked slots returned for user", bookedTimeSlots: bookedTimeSlots })
        }

        //get list of all the lotIDs where user has booked slot at least ones
        const lotIds = []
        for (let slot of bookedTimeSlots) {
            if (!lotIds.includes(slot.parkingLot)) {
                lotIds.push(slot.parkingLot)
            }
        }
        console.log(lotIds)
        //get all the ParkingLot details of those lots which are included in lotIDs
        var parkingLots = await ParkingLot.find({
            _id: {
                $in: lotIds
            }
        },{lotImages:0})

        //create a map from lotID to lotDetails for quick access of lockDetails
        var parkingLotMap= {}
        for(let lot of parkingLots){
            parkingLotMap[lot._id]={_id:lot._id,name:lot.name,address:lot.address,location:lot.location.coordinates,
                                    parkingChargesBike:lot.parkingChargesBike,parkingChargesCar:lot.parkingChargesCar}
        }


        bookedTimeSlots = bookedTimeSlots.map(timeSlot => {
            if (timeSlot.vehicleType === "Bike") {
                //calculate charges
                const charges = ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLotMap[timeSlot.parkingLot].parkingChargesBike
                //pas startTime and endTime as formatted strings
                //put details of parkingLot instead of just its ID
                return { ...timeSlot._doc, parkingLot: parkingLotMap[timeSlot.parkingLot],startTime:dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'), charges: charges }
            } else {
                //calculate charges
                const charges = ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLotMap[timeSlot.parkingLot].parkingChargesCar
                //pas startTime and endTime as formatted strings
                //put details of parkingLot instead of just its ID
                return { ...timeSlot._doc, parkingLot: parkingLotMap[timeSlot.parkingLot],startTime:dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'), charges: charges }
            }
        })
        return res.status(200).json({ msg: "Booked slots returned for user", bookedTimeSlots: bookedTimeSlots })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}


//Not being used currently
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


//tested
/*get Names of all parking lots */
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

        //fetch all the parkingLot Names and whether they are active
        var parkingLots = await ParkingLot.find({}, { name: 1,isActive:1 });

        parkingLots = parkingLots.map(lot => lot._doc)

        return res.status(200).json({ msg: "ParkingLots returned", parkingLots: parkingLots })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}

//tested
/*get all the bookedSlots ever booked in a particular parking Lot*/
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

        //get all the bookedSlots which are booked in this parkingLot
        var bookedTimeSlots = await BookedTimeSlot.find({
            parkingLot: req.query._id,
            paid:true
        })

        //get the details of parking Lot
        const parkingLot = await ParkingLot.findById(req.query._id)
        console.log(parkingLot)
    
        //if no slots booked till now in parkingLot
        if (bookedTimeSlots.length == 0) {
            return res.status(200).json({ msg: "Booked slots history returned for parking lot", bookedTimeSlots: bookedTimeSlots, parkingLotDetails: parkingLot })
        }

        //get all the userIds who have booker atleast one slot in that parkingLot
        const userIds = []
        for (var slot of bookedTimeSlots) {
            if (!userIds.includes(slot.booker)) {
                userIds.push(slot.booker)
            }
        }

        //get the firstName and lastName of users who booked the slots
        var users = await User.find({
            _id: {
                $in: userIds
            }
        }, {
            firstName: 1, lastName: 1
        })

        //create a userMap to access the user details corresponding to a userId
        var userMap = {}
        for (let user of users) {
            userMap[user._id] = { _id: user._id, name: user.firstName + " " + user.lastName }
        }
        console.log(userMap)


        bookedTimeSlots = bookedTimeSlots.map(timeSlot => {
            if (timeSlot.vehicleType == "Bike") {
                //calculate charges
                const charges = ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesBike
                //pas startTime and endTime as formatted strings
                //put details of booker instead of just its ID
                return { ...timeSlot._doc, charges: charges,startTime:dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'), booker: userMap[timeSlot.booker] }
            } else {
                //calculate charges
                const charges = ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesCar
                //pas startTime and endTime as formatted strings
                //put details of booker instead of just its ID
                return { ...timeSlot._doc, charges: charges,startTime:dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'), booker: userMap[timeSlot.booker] }
            }
        })
        console.log(bookedTimeSlots)

        return res.status(200).json({ msg: "Parking lots returned", bookedTimeSlots: bookedTimeSlots, parkingLotDetails: parkingLot })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}

//tested
/*make a particular parking Lot inactive*/
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

        //check if ID of the lot which is to be deleted is passed
        console.log(req.body)
        if (!req.body.id) {
            return res.status(400).json({ msg: "Please pass Parking Lot ID" })
        }
        
        //get the details of parkingLot to be deleted
        const updatedLot = await ParkingLot.findByIdAndUpdate(req.body.id,{isActive:false},{new:true})
        console.log(updatedLot.name,updatedLot.parkingChargesBike,updatedLot.parkingChargesCar)

        //finding the active timeslots booked in that particular parkingLot
        const bookedTimeSlots = await BookedTimeSlot.find({
            parkingLot: req.body.id,
            endTime: {
                $gte: Date.now()
            },
            cancelled:false,
            paid:true
        }, {
            booker: 1, startTime: 1, endTime: 1, vehicleType: 1
        })


        //get the userIds of all those users who have an active slot booked
        const userIds = bookedTimeSlots.map(slot => slot.booker)
        console.log(userIds)
        //get user details for sending them email
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

        //for each booked slot
        for (let ts of bookedTimeSlots) {
            const subject = "[Smart Parker] Booking Cancellation"
            
            const receiverMail = userMap[ts.booker].email

            //send email to user that their slot has been cancelled
            if (ts.vehicleType === "Bike") {
                const charges = ((ts.endTime - ts.startTime) / (1000 * 60 * 60)) * updatedLot.parkingChargesBike
                const html = `
                    Dear ${userMap[ts.booker].name}, 
                        We are sorry to inform you that due to some issues your parking booking for a Bike at ${updatedLot.name} between ${dayjs(ts.startTime).format('DD MMM hh:00 A')} and ${dayjs(ts.endTime).format('DD MMM hh:00 A')} has been cancelled. 
                        The charges for this parking you booked ${charges}, will be refunded to your account within 2 days
                `
                await sendEmail2({html,subject,receiverMail})
                //mark those slots as cancelled and adminCancelled as they are cancelledBy Admin
                await BookedTimeSlot.findByIdAndUpdate(ts._id,{cancelled:true,adminCancelled:true,cancelledAt:Date.now(),refunded:false})
            } else {
                const charges = ((ts.endTime - ts.startTime) / (1000 * 60 * 60)) * updatedLot.parkingChargesCar
                const html = `
                    Dear ${userMap[ts.booker].name}, 
                        We are sorry to inform you that due to some issues your parking booking for a Bike at ${updatedLot.name} between ${dayjs(ts.startTime).format('DD MMM hh:00 A')} and ${dayjs(ts.endTime).format('DD MMM hh:00 A')} has been cancelled. 
                        The charges for this parking you booked ${charges}, will be refunded to your account within 2 days
                `
                await sendEmail({html,subject,receiverMail})
                //mark those slots as cancelled and adminCancelled as they are cancelledBy Admin
                await BookedTimeSlot.findByIdAndUpdate(ts._id,{cancelled:true,adminCancelled:true,cancelledAt:Date.now(),refunded:false})
            }

        }
        
        return res.status(200).json({ msg: "Parking Lot Made Inactive" })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

//tested
/*Make parking lot active again*/
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
        //Mark parking Lot as active
        await ParkingLot.findByIdAndUpdate(req.body.id,{isActive:true})
        return res.status(200).json({msg: "Parking Lot Active Again"})
    }catch(err){
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}


//tested
/*Get all the cancelled Slots */
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
        
        //get all the slots which are cancelled
        var cancelledTimeSlots = await BookedTimeSlot.find({
            cancelled:true,
            paid:true
        })
        console.log(cancelledTimeSlots)

        //get the userIDs and parkingLot IDs of each booked slots
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

        //get users details such as name,email who have cancelled slot
        var users = await User.find({
            _id: {
                $in: userIds
            }

        }, {
            firstName: 1, lastName: 1,email:1
        })
        //get parkingLot details in which slot has cancelled
        var parkingLots = await ParkingLot.find({
            _id: {
                $in: lotIds
            }
        },
        {
            name:1,parkingChargesBike:1,parkingChargesCar:1
        })


        //create maps for quick access to details from IDs
        var userMap = {}
        for (let user of users) {
            userMap[user._id] = { _id: user._id,  name:user.firstName + " " + user.lastName, email: user.email }
        }

        var parkingLotMap = {}
        for(let lot of parkingLots){
            parkingLotMap[lot._id] = lot
        }


        //put the details and calculated charge in cancelledTimeSlots
        cancelledTimeSlots= cancelledTimeSlots.map(slot=>(
            slot.vehicleType==="Bike"?(
                {...slot._doc,charges:((slot.endTime - slot.startTime) / (1000 * 60 * 60))*parkingLotMap[slot.parkingLot].parkingChargesBike,
                    booker:userMap[slot.booker],
                    startTime:dayjs(slot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(slot.endTime).format('YYYY-MM-DD HH:00'),
                    parkingLot:parkingLotMap[slot.parkingLot]}
                ):
                (
                {...slot._doc,charges:((slot.endTime - slot.startTime) / (1000 * 60 * 60))*parkingLotMap[slot.parkingLot].parkingChargesCar,
                    booker:userMap[slot.booker],
                    startTime:dayjs(slot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(slot.endTime).format('YYYY-MM-DD HH:00'),
                    parkingLot:parkingLotMap[slot.parkingLot]}
                )
        ))

        return res.status(200).json({msg:"Cancelled slots returned",cancelledSlots:cancelledTimeSlots})
    }catch(err){
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}