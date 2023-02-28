const BookedTimeSlot = require('../models/bookedTimeSlot')
const ParkingLot = require('../models/ParkingLot')
const ParkingSlot = require('../models/ParkingSlot')
const User = require('../models/User')
const dayjs = require('dayjs')
const { postParkingValidator, getParkingValidator, bookSlotValidator } = require('../validators/joi-validator')
const { mongo, default: mongoose } = require('mongoose')

exports.postParkingLot = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }

    console.log("In post parking lot")
    const {error} = postParkingValidator.validate(req.body)
    if(error){
        return res.status(400).json({msg:"Please fill in all the fields in proper format"})
    }
    try{
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if(reqUser.role!=="admin"){
            return res.status(401).json({msg:"Unauthorized"})
        }
        var {parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng} = req.body
        console.log(parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng)
        noOfBikeSlots = parseInt(noOfBikeSlots)
        console.log(noOfBikeSlots)
        noOfCarSlots = parseInt(noOfCarSlots)
        parkingChargesBike = parseInt(parkingChargesBike)
        parkingChargesCar = parseInt(parkingChargesCar)
        console.log("Here")
        const loc = []
        loc.push(parseFloat(lat))
        loc.push(parseFloat(lng))
        const locPoint = {type:'Point',coordinates:loc}
        const newParkingLot = await ParkingLot.create({
            name:parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,location:locPoint
        })
        console.log(newParkingLot)
        const carParkingSlotsIDs = []
        const bikeParkingSlotsIDs = []
        for(i=0;i<noOfBikeSlots;i++){
            let parkingSlot = await ParkingSlot.create({parkingLot:newParkingLot._id,vehicleType:"Bike",createdAt:new Date().toISOString()})
            bikeParkingSlotsIDs.push(parkingSlot._id)
        }
        for(i=0;i<noOfCarSlots;i++){
            let parkingSlot = await ParkingSlot.create({parkingLot:newParkingLot._id,vehicleType:"Car",createdAt:new Date().toISOString()})
            carParkingSlotsIDs.push(parkingSlot._id)
        }
        console.log(bikeParkingSlotsIDs,carParkingSlotsIDs)
        await ParkingLot.findByIdAndUpdate(newParkingLot._id,{bikeParkingSlots:bikeParkingSlotsIDs,carParkingSlots:carParkingSlotsIDs})
        // const id=newParkingLot._id;
        // const newParkingLot = await ParkingLot.findOne({name:parkName})
        // const slots = await ParkingSlot.find({parkingLot:newParkingLot._id})
        // console.log(slots)

        return res.status(200).json({msg:"Parking Lot Added"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
    
}

exports.getParkingLots = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }
    console.log("In get parking Lots")
    const {error} = getParkingValidator.validate(req.query)
    console.log("Here")
    try{
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }
        console.log(req.query)
        var {lat,lng,startTime,endTime,vehicleType} = req.query;

        lat = parseFloat(lat)
        lng = parseFloat(lng)
        
        console.log("here")
        const parkingLots = await ParkingLot.aggregate([
        
            {
                $geoNear:{
                    "near":{
                        "type":"Point",
                        "coordinates":[lat,lng]
                    },
                    "distanceField":"distance",
                    "spherical":true,
                    "maxDistance":2000
                },
            }
        ])
        // console.log(parkingLots)
        const bookingStart = dayjs(startTime)
        const bookingEnd = dayjs(endTime)
        const periodHours = bookingEnd.diff(bookingStart,'hour')
        const storebookingStart = new Date(startTime).getTime()
        const storebookingEnd = new Date(endTime).getTime()
        console.log("Now finding booked")
        const bookedParkingSlots = await BookedTimeSlot.find({
            startTime:{
                $lte:storebookingEnd
            },
            endTime:{
                $gte:storebookingStart
            },
            vehicleType:vehicleType
        })
        console.log("Found booked")
        console.log(bookedParkingSlots)

        const freeParkingLots = []

        if(vehicleType=="Bike"){
            parkingLots.forEach((lot)=>{
                const freeSlots = lot.bikeParkingSlots.filter(slot=>!bookedParkingSlots.includes(slot))
                const engagedSlots = lot.bikeParkingSlots.filter(slot=>bookedParkingSlots.includes(slot))
                if(freeSlots.length>0){
                    // console.log(lot)
                    // console.log({id:lot._id,name:lot.name,charges:lot.parkingChargesBike*periodHours,freeSlots:freeSlots,engagedSlots:engagedSlots,address:lot.address,location:lot.location.coordinates,distance:lot.distance})
                    freeParkingLots.push({id:lot._id,name:lot.name,charges:lot.parkingChargesBike*periodHours,freeSlots:freeSlots,engagedSlots:engagedSlots,address:lot.address,location:lot.location.coordinates,distance:lot.distance})
                }
            })
        }else{
            parkingLots.forEach((lot)=>{
                const freeSlots = lot.carParkingSlots.filter(slot=>!bookedParkingSlots.includes(slot))
                const engagedSlots = lot.carParkingSlots.filter(slot=>bookedParkingSlots.includes(slot))
                if(freeSlots.length>0){
                    freeParkingLots.push({id:lot._id,name:lot.name,charges:lot.parkingChargesCar*periodHours,freeSlots:freeSlots,engagedSlots:engagedSlots,address:lot.address,location:lot.location.coordinates,distance:lot.distance})
                }
            })
        }
        

        console.log(freeParkingLots)
        return res.status(200).json({msg:"Free parking lots returned",freeParkingLots:freeParkingLots})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}

exports.bookSlot = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }
    const {error} = bookSlotValidator.validate(req.body)
    try{
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }

        const {lotId,slotId,startTime,endTime,vehicleType} = req.body
        console.log(lotId,slotId,startTime,endTime,vehicleType)
        const storebookingStart = new Date(startTime).getTime()
        const storebookingEnd = new Date(endTime).getTime()

        const futureBookedParkingSlots = await BookedTimeSlot.find({
            startTime:{
                $gte:Date.now()
            },
            vehicleType:vehicleType
        })

        const myBooked = futureBookedParkingSlots.filter(slot=>slot.booker==req.userId)

        if(myBooked.length>0){
            return res.status(400).json({msg:"You have already booked a slot"})
        }

        const bookedSlot = await BookedTimeSlot.create({
            startTime:storebookingStart,endTime:storebookingEnd,parkingSlot:mongoose.Types.ObjectId(slotId),booker:req.userId,vehicleType:vehicleType
        })
         
        return res.status(200).json({msg:"Slot Booked"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}
