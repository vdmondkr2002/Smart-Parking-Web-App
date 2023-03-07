const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {signUp,sendOTP,verifyEmail,signIn,getCurrentUser, sendFeedback, setProfilePic, sendSubcription} = require('../controllers/users')

router.get('',auth,getCurrentUser)
router.post('/sendOTP',sendOTP)
router.post('/verifyEmail',verifyEmail)
router.post('/signIn',signIn)
router.post('/feedback',sendFeedback)
router.post('/profilePic',auth,setProfilePic)
router.post('/notifications/subscribe',auth,sendSubcription)

module.exports = router