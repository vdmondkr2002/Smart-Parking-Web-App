const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {signUp,sendOTP,verifyEmail,signIn,getCurrentUser, sendFeedback, setProfilePic, sendSubcription, sendResetEmail, resetPassword, resendOTP} = require('../controllers/users')

router.get('',auth,getCurrentUser)
router.post('/sendOTP',sendOTP)
router.post('/resendOTP',resendOTP)
router.post('/verifyEmail',verifyEmail)
router.post('/signIn',signIn)
router.post('/feedback',sendFeedback)
router.post('/profilePic',auth,setProfilePic)
router.post('/notifications/subscribe',auth,sendSubcription)
router.post('/resetEmail',sendResetEmail)
router.post('/resetPassword',resetPassword)

module.exports = router