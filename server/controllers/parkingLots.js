const ParkingLot = require('../models/ParkingLot')
const ParkingSlot = require('../models/ParkingSlot')
const User = require('../models/User')
const { postParkingValidator, getParkingValidator } = require('../validators/joi-validator')

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
        const parkingLotsIDs = []
        for(i=0;i<noOfBikeSlots;i++){
            let parkingSlot = await ParkingSlot.create({parkingLot:newParkingLot._id,vehicleType:"Bike",createdAt:new Date().toISOString()})
            parkingLotsIDs.push(parkingSlot._id)
        }
        for(i=0;i<noOfCarSlots;i++){
            let parkingSlot = await ParkingSlot.create({parkingLot:newParkingLot._id,vehicleType:"Car",createdAt:new Date().toISOString()})
            parkingLotsIDs.push(parkingSlot._id)
        }
        console.log(parkingLotsIDs)
        await ParkingLot.findByIdAndUpdate(newParkingLot._id,{parkingSlots:parkingLotsIDs})
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
    const {error} = getParkingValidator.validate(req.body)
    console.log("Here")
    try{
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }
        console.log(req.body)
        var {lat,lng,startTime,endTime} = req.body;
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
                }
            }
        ])
        console.log(parkingLots)

        return res.status(200).json({msg:"parking lots returned"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}

