const mongoose = require('mongoose')

/* 
This schema holds data related to booking of a particular vehicle at particular parking slot in a parking lot
for a particular period of time by a booker
it also holds additional data such as whether parking lot is canecellable,
if its cancelled whether cancelled by admin or user self cancelled it, cancellation time,
additional details for verification of car or bike when it arrives at parking lot, such as carImage, vehicleNo,
Payment details such as order id and whole payment details,
if payment is cancelled then whether money is refunded to booker, if yes then refund details
whether user is notified before time period of booking starts
*/
const BookedTimeSlotSchema = mongoose.Schema({
    startTime:{
        type:Number
    },
    endTime:{
        type:Number
    },
    parkingSlot:{
        type:mongoose.Schema.Types.ObjectId
    },
    parkingLot:{
        type:mongoose.Schema.Types.ObjectId
    },
    booker:{
        type:mongoose.Schema.Types.ObjectId
    },
    vehicleType:{
        type:String,
        required:true
    },
    cancellable:{
        type:Boolean,
        default:false,
        required:true
    },
    cancelled:{
        type:Boolean,
        default:false,
        required:true
    },
    adminCancelled:{
        type:Boolean,
        default:false,
        required:true
    },
    cancelledAt:{
        type:Number
    },
    vehicleNo:{
        type:String,
        required:true
    },
    carImage:{
        type:String,
        required:true
    },
    orderID:{
        type:String,
        required:true,
    },
    paymentDetails:{
        type:Object
    },
    paid:{
        type:Boolean,
        required:true,
        default:false
    },
    refunded:{
        type:Boolean,
    },
    refundDetails:{
        type:Object
    },
    notified:{
        type:Boolean,
        default:false
    }
})

const BookedTimeSlot = mongoose.model('BookedTimeSlot',BookedTimeSlotSchema)
module.exports = BookedTimeSlot