const Razorpay = require('razorpay')

//razorpay configuration for our account
exports.instance = new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET
})