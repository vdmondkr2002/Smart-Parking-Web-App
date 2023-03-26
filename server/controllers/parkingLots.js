const BookedTimeSlot = require('../models/BookedTimeSlot.js')
const ParkingLot = require('../models/ParkingLot')
const ParkingSlot = require('../models/ParkingSlot')
const User = require('../models/User')
const dayjs = require('dayjs')
const { postParkingValidator, getParkingValidator, bookSlotValidator } = require('../validators/joi-validator')
const mongoose = require('mongoose')
const axios = require('axios')
const sendEmail = require('../Utils/sendEmail.js')
const sendEmail2 = require('../Utils/sendEmail2')

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
        var {parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng,openTime,closeTime,imgFiles,currTimeStamp} = req.body
        console.log(parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng,openTime,closeTime,currTimeStamp)
        
        noOfBikeSlots = parseInt(noOfBikeSlots)
        console.log(noOfBikeSlots)
        noOfCarSlots = parseInt(noOfCarSlots)
        parkingChargesBike = parseInt(parkingChargesBike)
        parkingChargesCar = parseInt(parkingChargesCar)

        openTime = Number(openTime)
        closeTime = Number(closeTime)
        // if(openTime>closeTime){
        //     let t=openTime
        //     openTime=closeTime
        //     closeTime=t
        // }
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
            let parkingSlot = await ParkingSlot.create({parkingLot:newParkingLot._id,vehicleType:"Bike",createdAt:new Date(currTimeStamp).toISOString()})
            bikeParkingSlotsIDs.push(parkingSlot._id)
        }
        for(i=0;i<noOfCarSlots;i++){
            let parkingSlot = await ParkingSlot.create({parkingLot:newParkingLot._id,vehicleType:"Car",createdAt:new Date(currTimeStamp).toISOString()})
            carParkingSlotsIDs.push(parkingSlot._id)
        }
        console.log(bikeParkingSlotsIDs,carParkingSlotsIDs)
        await ParkingLot.findByIdAndUpdate(newParkingLot._id,{bikeParkingSlots:bikeParkingSlotsIDs,carParkingSlots:carParkingSlotsIDs})
        
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
        
        let hrs1 = new Date(startTime).getHours()
        let hrs2 = new Date(endTime).getHours()
        var parkingLots = await ParkingLot.aggregate([
        
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
                isActive:true
            }},
            
        ])
        
        parkingLots = parkingLots.filter(lot=>{
            console.log(lot.openTime,lot.closeTime)
            if(lot.openTime<lot.closeTime){
                if(lot.openTime<=hrs1 & hrs2<=lot.closeTime){
                    return true;
                }else{
                    return false;
                }
            }else{
                
                if((lot.openTime<=hrs1 && hrs2<=lot.closeTime)
                ||(lot.openTime<=hrs1+24 && hrs2+24<=lot.closeTime+24)
                ||(lot.openTime<=hrs1 && hrs2<=lot.closeTime+24)){
                    return true;
                }else{
                    return false;
                }
            }
        })
        
        
        // console.log(parkingLots)
        const bookingStart = dayjs(startTime)
        const bookingEnd = dayjs(endTime)
        const periodHours = bookingEnd.diff(bookingStart,'hour')
        const storebookingStart = new Date(startTime).getTime()
        const storebookingEnd = new Date(endTime).getTime()
        console.log("Now finding booked")
        const bookedParkingSlots = await BookedTimeSlot.find({
            startTime:{
                $lt:storebookingEnd
            },
            endTime:{
                $gt:storebookingStart
            },
            vehicleType:vehicleType,
            cancelled:false,
            paid:true
        })
        console.log("Found booked")
        // console.log(bookedParkingSlots)
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
        

        // console.log(freeParkingLots)
        return res.status(200).json({msg:"Free parking lots returned",freeParkingLots:freeParkingLots})
        
    }catch(err){
        console.log(err)
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
            booker:req.userId,
            paid:true
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
        
        
        bookedTimeSlots = bookedTimeSlots.map(timeSlot=>{
            delete timeSlot._doc.carImage
            // {...timeSlot,charges:((timeSlot.endTime-timeSlot.startTime)/1000*60*60)*timeSlot.parkingLot.}
            if(timeSlot.vehicleType=="Bike"){
                const charges= ((timeSlot.endTime-timeSlot.startTime)/(1000*60*60))*parkingLotMap[timeSlot.parkingLot].parkingChargesBike
                return {...timeSlot._doc,parkingLot:parkingLotMap[timeSlot.parkingLot],startTime:dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'),charges:charges}
            }else{
                const charges= ((timeSlot.endTime-timeSlot.startTime)/(1000*60*60))*parkingLotMap[timeSlot.parkingLot].parkingChargesCar
                return {...timeSlot._doc,parkingLot:parkingLotMap[timeSlot.parkingLot],startTime:dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'),charges:charges}
            }
        })
        console.log(bookedTimeSlots)
        
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
        const reqUser = await User.findById(req.userId)
        console.log(req.body)
        if(!req.body.id && !req.body.currTimeStamp){
            return res.status(400).json({msg:"Please pass parameters"})
        }
        const bookedSlot = await BookedTimeSlot.findById(req.body.id)
        console.log(bookedSlot.startTime,bookedSlot.endTime,bookedSlot.vehicleType)
        const parkingLot = await ParkingLot.findById(bookedSlot.parkingLot)
        if(!bookedSlot.cancellable){
            return res.status(200).json({msg:"You cannot cancell this booked slot"})
        }
        
        const subject = "[Smart Parker] You Cancelled a Booked Slot"
        var html=''
        if(bookedSlot.vehicleType=='Car'){
            const charges = ((bookedSlot.endTime - bookedSlot.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesCar
            html = `
            <div
                    class="container"
                    style="max-width: 90%; margin: auto; padding-top: 20px"
                >
                    Dear ${reqUser.firstName+" "+reqUser.lastName}, 
                    You booking for a <b>Car</b> at <b>${parkingLot.name}</b> between <b>${dayjs(bookedSlot.startTime)}</b> and <b>${dayjs(bookedSlot.endTime)}</b> has been cancelled. 
                    The charges for this parking you booked <b>${charges}</b>, 70% of that will be refunded to your account within 2 days
                </div>
            `
        }else{
            const charges = ((bookedSlot.endTime - bookedSlot.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesBike
            var html=`
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                Dear ${reqUser.firstName+" "+reqUser.lastName}, 
                You booking for a <b>Bike</b> at <b>${parkingLot.name}</b> between <b>${dayjs(bookedSlot.startTime)}</b> and <b>${dayjs(bookedSlot.endTime)}</b> has been cancelled. 
                The charges for this parking you booked <b>${charges}</b>, 70% of that will be refunded to your account within 2 days
            </div>
        `
        }
        const receiverMail = reqUser.email
        await sendEmail2({html,subject,receiverMail})
        await BookedTimeSlot.findByIdAndUpdate(req.body.id,{cancelled:true,cancelledAt:Date.now(),refunded:false})
        return res.status(200).json({msg:"Your Booked Slot Cancelled successfully"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}

