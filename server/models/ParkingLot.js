const mongoose = require('mongoose')
const PointSchema = require('./Point')

/*
This schema holds data related to a particular parking lot
Its name & addres, how many number of cars and bikes it can hold,
parking charges of a car and bike,  at what time it opens and closes,
The ids of all parking slots it holds,
its location as a point with latitude and longitude,
images of parking lot,
Whether the parking lot is active
*/
const ParkingLotSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    noOfCarSlots:{
        type:Number,
        required:true
    },
    noOfBikeSlots:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    parkingChargesCar:{
        type:Number,
        required:true
    },
    parkingChargesBike:{
        type:Number,
        required:true
    },
    openTime:{
        type:Number
    },
    closeTime:{
        type:Number
    },
    carParkingSlots:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ParkingSlot'
    }],
    bikeParkingSlots:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ParkingSlot'
    }],
    location:{
        type:PointSchema,
        required:true
    },
    lotImages:{
        type:[String]
    },
    isActive:{
        type:Boolean,
        default:true,
        required:true
    }
})

ParkingLotSchema.index({location:"2dsphere"})
const ParkingLot = mongoose.model('ParkingLot',ParkingLotSchema)

module.exports = ParkingLot