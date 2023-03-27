const mongoose = require('mongoose')

/* This schema holds data related to payment done for booking or cancellation
it contains orderID, paymentID and sign*/
const PaymentSchema = mongoose.Schema({
    orderID:{
        type:String,
        required:true
    },
    paymentID:{
        type:String,
        required:true
    },
    sign:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
        default:"book"
    }
})

const Payment = mongoose.model('Payment',PaymentSchema)
module.exports = Payment