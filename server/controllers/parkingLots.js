const BookedTimeSlot = require('../models/BookedTimeSlot.js')
const ParkingLot = require('../models/ParkingLot')
const ParkingSlot = require('../models/ParkingSlot')
const User = require('../models/User')
const dayjs = require('dayjs')
const { postParkingValidator, getParkingValidator, bookSlotValidator } = require('../validators/joi-validator')
const mongoose = require('mongoose')
const axios = require('axios')

exports.postParkingLot = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }

    console.log("In post parking lot")
    console.log(req.body)
    const {error} = postParkingValidator.validate(req.body)
    if(error){
        return res.status(400).json({msg:error.details[0].message})
    }
    try{
        const reqUser = await User.findById(req.userId)
        console.log(reqUser)
        if(reqUser.role!=="admin"){
            return res.status(401).json({msg:"Unauthorized"})
        }
        var {parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng,openTime,closeTime,imgFiles} = req.body
        console.log(parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng,openTime,closeTime)
        
        noOfBikeSlots = parseInt(noOfBikeSlots)
        console.log(noOfBikeSlots)
        noOfCarSlots = parseInt(noOfCarSlots)
        parkingChargesBike = parseInt(parkingChargesBike)
        parkingChargesCar = parseInt(parkingChargesCar)

        openTime = Number(openTime)
        closeTime = Number(closeTime)
        console.log(openTime,closeTime)
        // return res.status(400).json({msg:"arking Lot Added"})
        console.log("Here")
        const loc = []
        loc.push(parseFloat(lat))
        loc.push(parseFloat(lng))
        const locPoint = {type:'Point',coordinates:loc}
        const newParkingLot = await ParkingLot.create({
            name:parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,location:locPoint,openTime:openTime,closeTime:closeTime,lotImages:imgFiles
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
        console.log(startTime,endTime)
        lat = parseFloat(lat)
        lng = parseFloat(lng)
        
        hrs1 = new Date(startTime).getHours()
        hrs2 = new Date(endTime).getHours()
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
                
            },
            {$match:{
                openTime:{
                    $lte:hrs1
                },
                closeTime:{
                    $gte:hrs2
                },
                isActive:true
            }},
            
        ])
        // return res.status(400).json({msg:"Free parking lots returned"})
        // let url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2"+"&lat="+lat+"&lon="+lng;
        // const response = await axios.get(url,{headers:{'Access-Control-Allow-Origin':'https://o2cj2q.csb.app',mode:'cors'}})

        // console.log(response.data)
        
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
        const bookedParkingSlotsIDs = bookedParkingSlots.map(slot=>slot.parkingSlot.toString())
        console.log(bookedParkingSlotsIDs)
        const freeParkingLots = []

        if(vehicleType=="Bike"){
            parkingLots.forEach((lot)=>{
                const freeSlots = lot.bikeParkingSlots.filter(slot=>!bookedParkingSlotsIDs.includes(slot._id.toString()))
                const engagedSlots = lot.bikeParkingSlots.filter(slot=>bookedParkingSlotsIDs.includes(slot._id.toString()))
                if(freeSlots.length>0){
                    // console.log(lot)
                    // console.log({id:lot._id,name:lot.name,charges:lot.parkingChargesBike*periodHours,freeSlots:freeSlots,engagedSlots:engagedSlots,address:lot.address,location:lot.location.coordinates,distance:lot.distance})
                    freeParkingLots.push({id:lot._id,name:lot.name,charges:lot.parkingChargesBike*periodHours,lotImages:lot.lotImages,freeSlots:freeSlots,engagedSlots:engagedSlots,address:lot.address,location:lot.location.coordinates,distance:lot.distance})
                }
            })
        }else{
            parkingLots.forEach((lot)=>{
                const freeSlots = lot.carParkingSlots.filter(slot=>!bookedParkingSlotsIDs.includes(slot._id.toString()))
                const engagedSlots = lot.carParkingSlots.filter(slot=>bookedParkingSlotsIDs.includes(slot._id.toString()))
                if(freeSlots.length>0){
                    freeParkingLots.push({id:lot._id,name:lot.name,charges:lot.parkingChargesCar*periodHours,lotImages:lot.lotImages,freeSlots:freeSlots,engagedSlots:engagedSlots,address:lot.address,location:lot.location.coordinates,distance:lot.distance})
                }
            })
        }
        

        console.log(freeParkingLots)
        return res.status(200).json({msg:"Free parking lots returned",freeParkingLots:freeParkingLots})
    }catch(err){
        console.log(err)
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
        
        
        const {lotId,slotId,startTime,endTime,vehicleType,carImg,vehicleNo,cancellable} = req.body
        console.log(lotId,slotId,startTime,endTime,vehicleType,vehicleNo,cancellable)
        const user = await User.findById(req.userId)
        if(!user.profilePic){
            return res.status(400).json({msg:"Please Upload a profile photo first for verification"})
        }
        const storebookingStart = new Date(startTime).getTime()
        const storebookingEnd = new Date(endTime).getTime()
        const date = new Date()
        console.log(new Date(startTime).getDate())
        if((storebookingEnd-storebookingStart)<=0){
            return res.status(400).json({msg:"Please Enter a Valid time frame"})
        }else if(storebookingStart<Date.now()){
            return res.status(400).json({msg:"Cannot book slot in past"})
        }else if(new Date(startTime).getDate()>date.getDate()+1){
            console.log("Helo")
            return res.status(400).json({msg:"Cannot book a slot starting after next day"})
        }else if( (storebookingEnd-storebookingStart)/(1000*60*60)>3){
            return res.status(400).json({msg:"Slot cannot be of more than three hours"})
        }

        const futureBookedParkingSlots = await BookedTimeSlot.find({
            endTime:{
                $gte:Date.now()
            },
            vehicleType:vehicleType,
            booker:req.userId
        })

        if(futureBookedParkingSlots.length>0){
            return res.status(400).json({msg:"You have already booked a slot"})
        }

        const vehicleBookedSlots = await BookedTimeSlot.find({
            vehicleNo:vehicleNo
        })
        if(vehicleBookedSlots.length>0){
            return res.status(400).json({msg:"This car already has an active slot booked"})
        }


        const bookedSlot = await BookedTimeSlot.create({
            startTime:storebookingStart,endTime:storebookingEnd,parkingSlot:mongoose.Types.ObjectId(slotId),
            parkingLot:mongoose.Types.ObjectId(lotId),booker:req.userId,vehicleType:vehicleType,
            carImage:carImg,vehicleNo:vehicleNo,cancellable:cancellable
        })
         
        return res.status(200).json({msg:"Slot Booked"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}

exports.getBookedTimeSlots = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }
    console.log("Get Booked time slots for->",req.userId)
    try{
        var bookedTimeSlots = await BookedTimeSlot.find({
            booker:req.userId
        })
        const slotIds = []
        for(let slot of bookedTimeSlots){
            if(!slotIds.includes(slot.parkingLot)){
                slotIds.push(slot.parkingLot)
            }
        }
        var parkingLots = await ParkingLot.find({
            _id:{
                $in:slotIds
            }
        })
        var parkingLotMap= {}
        for(let lot of parkingLots){
            parkingLotMap[lot._id]={_id:lot._id,name:lot.name,address:lot.address,location:lot.location.coordinates,parkingChargesBike:lot.parkingChargesBike,parkingChargesCar:lot.parkingChargesCar}
        }
        

        
        console.log(parkingLots)
        console.log(parkingLotMap)
        
        
        console.log(bookedTimeSlots)
        bookedTimeSlots = bookedTimeSlots.map(timeSlot=>{
            delete timeSlot._doc.carImage
            // {...timeSlot,charges:((timeSlot.endTime-timeSlot.startTime)/1000*60*60)*timeSlot.parkingLot.}
            if(timeSlot.vehicleType=="Bike"){
                const charges= ((timeSlot.endTime-timeSlot.startTime)/(1000*60*60))*parkingLotMap[timeSlot.parkingLot].parkingChargesBike
                return {...timeSlot._doc,parkingLot:parkingLotMap[timeSlot.parkingLot],charges:charges}
            }else{
                const charges= ((timeSlot.endTime-timeSlot.startTime)/(1000*60*60))*parkingLotMap[timeSlot.parkingLot].parkingChargesCar
                return {...timeSlot._doc,parkingLot:parkingLotMap[timeSlot.parkingLot],charges:charges}
            }
        })
        console.log(bookedTimeSlots)
        // const street = 'Shakar Pawshe Road'
        // const place = 'KDMC Kolsewadi Municipal Hospital'
        let url = `https://nominatim.openstreetmap.org/search?
        city=Dombivli
        &state=Maharashtra
        &country=India
        &postalcode=421306&format=json`;
        const response = await axios.get(url,{headers:{'Access-Control-Allow-Origin':'https://o2cj2q.csb.app',mode:'cors'}})
        
        console.log(response.data)
        return res.status(200).json({msg:"Booked slots returned for user",bookedTimeSlots:bookedTimeSlots})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}

exports.cancelBookedSlot = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }
    try{
        console.log(req.body)
        if(!req.body.id){
            return res.status(400).json({msg:"Please pass bookedSlotId"})
        }
        const bookedSlot = await BookedTimeSlot.findById(req.body.id)
        console.log(bookedSlot.startTime,bookedSlot.endTime,bookedSlot.vehicleType)
        if(!bookedSlot.cancellable){
            return res.status(200).json({msg:"You cannot cancell this booked slot"})
        }
        await BookedTimeSlot.findByIdAndDelete(req.body.id)
        return res.status(200).json({msg:"Your Booked Slot Cancelled successfully"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}

