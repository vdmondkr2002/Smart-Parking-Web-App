const mongoose = require('mongoose')


const ParkingSlotSchema = mongoose.Schema({
    parkingLot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ParkingLot'
    },
    vehicleType:{
        type:String,
        required:true
    }, 
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const ParkingSlot = mongoose.model('ParkingSlot',ParkingSlotSchema)

module.exports = ParkingSlot