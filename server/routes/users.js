const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {signUp,sendOTP,verifyEmail,signIn,getCurrentUser, sendFeedback} = require('../controllers/users')

router.get('',auth,getCurrentUser)
router.post('/signUp',signUp)
router.post('/sendOTP',sendOTP)
router.post('/verifyEmail',verifyEmail)
router.post('/signIn',signIn)
router.post('/feedback',sendFeedback)

module.exports = router