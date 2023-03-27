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

//tested
/*admin adds a new parking lot*/
exports.postParkingLot = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }

    console.log("In post parking lot")
    const {error} = postParkingValidator.validate(req.body)
    if(error){
        return res.status(400).json({msg:error.details[0].message})
    }
    try{
        //get current user
        const reqUser = await User.findById(req.userId)
        
        //if user is admin
        if(reqUser.role!=="admin"){
            return res.status(401).json({msg:"Unauthorized"})
        }
        
        var {parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng,openTime,closeTime,imgFiles,currTimeStamp} = req.body
        console.log(parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng,openTime,closeTime,currTimeStamp)
        
        //convert details to desired format
        noOfBikeSlots = parseInt(noOfBikeSlots)
        noOfCarSlots = parseInt(noOfCarSlots)
        parkingChargesBike = parseInt(parkingChargesBike)
        parkingChargesCar = parseInt(parkingChargesCar)
        openTime = Number(openTime)
        closeTime = Number(closeTime)
       
        //put locPoint in format according to schema
        const loc = []
        loc.push(parseFloat(lat))
        loc.push(parseFloat(lng))
        const locPoint = {type:'Point',coordinates:loc}
        
        //save parking lot in database
        const newParkingLot = await ParkingLot.create({
            name:parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,location:locPoint,openTime:openTime,closeTime:closeTime,lotImages:imgFiles
        })


        const carParkingSlotsIDs = []
        const bikeParkingSlotsIDs = []
        //save bike parking slots in database and push each slot id to array
        for(i=0;i<noOfBikeSlots;i++){
            let parkingSlot = await ParkingSlot.create({parkingLot:newParkingLot._id,vehicleType:"Bike"})
            bikeParkingSlotsIDs.push(parkingSlot._id)
        }
        //save car parking slots in database and push each slot id to array
        for(i=0;i<noOfCarSlots;i++){
            let parkingSlot = await ParkingSlot.create({parkingLot:newParkingLot._id,vehicleType:"Car"})
            carParkingSlotsIDs.push(parkingSlot._id)
        }
        //save bike and car slot IDs to ParkingLot
        await ParkingLot.findByIdAndUpdate(newParkingLot._id,{bikeParkingSlots:bikeParkingSlotsIDs,carParkingSlots:carParkingSlotsIDs})
        
        return res.status(200).json({msg:"Parking Lot Added"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
    
}

//tested
/*when user searches for free parking lots around a location*/
exports.getParkingLots = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }
    console.log("In get parking Lots")
    const {error} = getParkingValidator.validate(req.query)
    
    try{
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }

        //get the details
        var {lat,lng,startTime,endTime,vehicleType,currTime} = req.query;
        console.log(lat,lng,startTime,endTime,vehicleType,currTime)
        //get timestamps
        const storebookingStart = new Date(startTime).getTime()
        const storebookingEnd = new Date(endTime).getTime()
        const currTimeStamp = new Date(currTime).getTime()

        //check if this startTime and endTime pair are valid according to conditions
        /*endTime is less than startTime OR
        starTime is less Than currTime OR
        trying to Book a slot starting after next day OR
        trying to Book a slot with duration of more than 2 hours
        */
        if ((storebookingEnd - storebookingStart) <= 0) {
            return res.status(400).json({ msg: "Please Enter a Valid time frame" })
        } else if (storebookingStart < currTimeStamp) {
            return res.status(400).json({ msg: "Cannot book slot in past" })
        } else if (new Date(startTime).getDate() > new Date(currTime).getDate() + 1) {
            return res.status(400).json({ msg: "Cannot book a slot starting after next day" })
        } else if ((storebookingEnd - storebookingStart) / (1000 * 60 * 60) > 3) {
            return res.status(400).json({ msg: "Slot cannot be of more than three hours" })
        }


        console.log("Now finding booked..")
        


        //convert to desired format
        lat = parseFloat(lat)
        lng = parseFloat(lng)
        
        //get hours when parking is going to start and end
        let hrs1 = new Date(startTime).getHours()
        let hrs2 = new Date(endTime).getHours()

        //query the database to get active parkinglots inside 2km circle of a location
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
            }}
        ])
        
        //get only those parkinglots which will be open in whole timeframe of parking
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
        
        

        //get all the booked slots in the timeframe selected
        //fetch only the parkingSlot which is booked
        let bookedParkingSlotsIDs = await BookedTimeSlot.find({
            startTime:{
                $lt:storebookingEnd
            },
            endTime:{
                $gt:storebookingStart
            },
            vehicleType:vehicleType,
            cancelled:false,
            paid:true
        },{_id:0,parkingSlot:1})

        bookedParkingSlotsIDs = bookedParkingSlotsIDs.map(slotID=>slotID.toString())
        console.log(bookedParkingSlotsIDs)
        
        //This will contain all the parking lots whose at least one parking slot is free in the selected time frame
        const freeParkingLots = []

    
        if(vehicleType=="Bike"){
            parkingLots.forEach((lot)=>{
                //freeSlots are the one not included in bookedSlotIDs
                //engagedSlots are the one included in bookedSlotIDs
                const freeSlots = lot.bikeParkingSlots.filter(slot=>!bookedParkingSlotsIDs.includes(slot._id.toString()))
                const engagedSlots = lot.bikeParkingSlots.filter(slot=>bookedParkingSlotsIDs.includes(slot._id.toString()))
                //if at least one parking slot is free
                if(freeSlots.length>0){
                    freeParkingLots.push({id:lot._id,name:lot.name,charges:lot.parkingChargesBike*periodHours,lotImages:lot.lotImages,freeSlots:freeSlots,engagedSlots:engagedSlots,address:lot.address,location:lot.location.coordinates,distance:lot.distance})
                }
            })
        }else{
            parkingLots.forEach((lot)=>{
                //freeSlots are the one not included in bookedSlotIDs
                //engagedSlots are the one included in bookedSlotIDs
                const freeSlots = lot.carParkingSlots.filter(slot=>!bookedParkingSlotsIDs.includes(slot._id.toString()))
                const engagedSlots = lot.carParkingSlots.filter(slot=>bookedParkingSlotsIDs.includes(slot._id.toString()))
                //if at least one parking slot is free
                if(freeSlots.length>0){
                    freeParkingLots.push({id:lot._id,name:lot.name,charges:lot.parkingChargesCar*periodHours,lotImages:lot.lotImages,freeSlots:freeSlots,engagedSlots:engagedSlots,address:lot.address,location:lot.location.coordinates,distance:lot.distance})
                }
            })
        }
        
        return res.status(200).json({msg:"Free parking lots returned",freeParkingLots:freeParkingLots})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg:"Something went wrong.."})
    }
}


//tested
/* returns the all of the slots booked by a particular user*/
exports.getBookedTimeSlots = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }
    console.log("Get Booked time slots for->",req.userId)
    try{
        //get all of the slots which are booked by user
        var bookedTimeSlots = await BookedTimeSlot.find({
            booker:req.userId,
            paid:true
        },{carImage:0})


        //get list of all the lotIDs where user has booked slot at least ones
        const lotIds = []
        for(let slot of bookedTimeSlots){
            if(!lotIds.includes(slot.parkingLot)){
                lotIds.push(slot.parkingLot)
            }
        }
        console.log(lotIds)
        //get all the ParkingLot details of those lots which are included in lotIDs
        var parkingLots = await ParkingLot.find({
            _id:{
                $in:lotIds
            }
        },{lotImages:0})
        //create a map from lotID to lotDetails for quick access of lockDetails
        var parkingLotMap= {}
        for(let lot of parkingLots){
            parkingLotMap[lot._id]={_id:lot._id,name:lot.name,address:lot.address,location:lot.location.coordinates,
                                    parkingChargesBike:lot.parkingChargesBike,parkingChargesCar:lot.parkingChargesCar}
        }
        

        
        
        bookedTimeSlots = bookedTimeSlots.map(timeSlot=>{
            if(timeSlot.vehicleType=="Bike"){
                //calculate charges
                const charges = ((timeSlot.endTime-timeSlot.startTime)/(1000*60*60))*parkingLotMap[timeSlot.parkingLot].parkingChargesBike
                //pas startTime and endTime as formatted strings
                //put details of parkingLot instead of just its ID
                return {...timeSlot._doc,parkingLot:parkingLotMap[timeSlot.parkingLot],startTime:dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'),charges:charges}
            }else{
                //calculate charges
                const charges= ((timeSlot.endTime-timeSlot.startTime)/(1000*60*60))*parkingLotMap[timeSlot.parkingLot].parkingChargesCar
                //pas startTime and endTime as formatted strings
                //put details of parkingLot instead of just its ID
                return {...timeSlot._doc,parkingLot:parkingLotMap[timeSlot.parkingLot],startTime:dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),endTime:dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'),charges:charges}
            }
        })
        console.log("Got Booked slots")
        
        return res.status(200).json({msg:"Booked slots returned for user",bookedTimeSlots:bookedTimeSlots})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}

//tested
/* User cancels an already booked slot by himself/herself*/
exports.cancelBookedSlot = async(req,res)=>{
    if(!req.userId){
        return res.status(401).json({msg:"Unauthorized"})
    }
    try{

        //get the user requesting to cancel
        const reqUser = await User.findById(req.userId)
        console.log(req.body)

        //if bookedSlot ID is not passed
        if(!req.body.id){
            return res.status(400).json({msg:"Please pass parameters"})
        }

        //get the bookedSlot details
        const bookedSlot = await BookedTimeSlot.findById(req.body.id,{
            startTime:1,endTime:1,vehicleType:1,booker:1
        })
        console.log(bookedSlot.startTime,bookedSlot.endTime,bookedSlot.vehicleType)
        
        //check if the booker of slot same as the one requesting to cancel it
        if(bookedSlot.booker.tString()!=req.userId.toString()){
            return res.status(400).json({msg:"You are not the booker of this slot"})
        }
        //a slot can only be cancelled if its cancellable
        if(!bookedSlot.cancellable){
            return res.status(400).json({msg:"You cannot cancel this booked slot"})
        }


        //get the parkingLot details
        const parkingLot = await ParkingLot.findById(bookedSlot.parkingLot,{
            parkingChargesBike:1,parkingChargesCar:1,name:1
        })

        
        
        //send an email to the booker as the confirmation of cancellation of slot
        const subject = "[Smart Parker] You Cancelled a Booked Slot"
        var html=''
        if(bookedSlot.vehicleType=='Car'){
            const charges = ((bookedSlot.endTime - bookedSlot.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesCar
            html = `
                    Dear ${reqUser.firstName+" "+reqUser.lastName}, 
                        Your booking for a Car at ${parkingLot.name} between ${dayjs(bookedSlot.startTime).format('DD MMM hh:00 A')} and ${dayjs(bookedSlot.endTime).format('DD MMM hh:00 A')} has been cancelled. 
                        The charges for this parking you booked ${charges}, 70% of that will be refunded to your account within 2 days
            `
        }else{
            const charges = ((bookedSlot.endTime - bookedSlot.startTime) / (1000 * 60 * 60)) * parkingLot.parkingChargesBike
            var html=`
                Dear ${reqUser.firstName+" "+reqUser.lastName}, 
                    Your booking for a Bike at ${parkingLot.name} between ${dayjs(bookedSlot.startTime).format('DD MMM hh:00 A')} and ${dayjs(bookedSlot.endTime).format('DD MMM hh:00 A')} has been cancelled. 
                    The charges for this parking you booked ${charges}, 70% of that will be refunded to your account within 2 days
        `
        }
        const receiverMail = reqUser.email
        await sendEmail2({html,subject,receiverMail,name:reqUser.firstName})


        //update the slot as cancelled and not refunded yet
        await BookedTimeSlot.findByIdAndUpdate(req.body.id,{cancelled:true,cancelledAt:Date.now(),refunded:false})
        return res.status(200).json({msg:"Your Booked Slot Cancelled successfully"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}

