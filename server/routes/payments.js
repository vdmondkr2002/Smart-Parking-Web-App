const express = require('express')
const router = express.Router()
const { bookPaymentVerification, getRazorPayKey, checkoutRefund, checkoutBookSlot, refundPaymentVerification} = require('../controllers/payments')
const auth = require('../middleware/auth')

router.post('/checkoutBookSlot',auth,checkoutBookSlot)
router.post('/verifyBookingPayment',bookPaymentVerification)
router.get('/razorPayKey',auth,getRazorPayKey)
router.post('/checkoutRefund',auth,checkoutRefund)
router.post('/verifyRefundPayment',refundPaymentVerification)

module.exports = router