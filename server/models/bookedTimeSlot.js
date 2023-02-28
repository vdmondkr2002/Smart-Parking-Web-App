const mongoose = require('mongoose')

const BookedTimeSlotSchema = mongoose.Schema({
    startTime:{
        type:Date
    },
    endTime:{
        type:Date
    },
    parkingSlot:{
        type:mongoose.Schema.Types.ObjectId
    },
    booker:{
        type:mongoose.Schema.Types.ObjectId
    },
    vehicleType:{
        type:String,
        required:true
    }
})

const BookedTimeSlot = mongoose.model('BookedTimeSlot',BookedTimeSlotSchema)
module.exports = BookedTimeSlot