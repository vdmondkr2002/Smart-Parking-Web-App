const mongoose = require('mongoose')

/*This is just a schema which indicates a single parking slot inside
a particular parking lot, the type of vehicle it can hold*/

const ParkingSlotSchema = mongoose.Schema({
    parkingLot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ParkingLot'
    },
    vehicleType:{
        type:String,
        required:true
    }
})

const ParkingSlot = mongoose.model('ParkingSlot',ParkingSlotSchema)

module.exports = ParkingSlot