const express = require('express')
const router = express.Router()
const { bookPaymentVerification, getRazorPayKey, checkoutRefund, checkoutBookSlot, refundPaymentVerification} = require('../controllers/payments')
const auth = require('../middleware/auth')

/*Router indicates the mapping of url string with corresponding handler(controller) function*/

/* This route is designed to handle requests where payment is involved
In application mainly two types of payments: one to book a slot and other one to pay refunds to the bookers who have cancelled their slots
or got their slots cancelled due to some issues
verification is the verification of payment called after payment is done
razorpay key is passed securely to frontend*/
router.post('/checkoutBookSlot',auth,checkoutBookSlot)
router.post('/verifyBookingPayment',bookPaymentVerification)
router.get('/razorPayKey',auth,getRazorPayKey)
router.post('/checkoutRefund',auth,checkoutRefund)
router.post('/verifyRefundPayment',refundPaymentVerification)

module.exports = router