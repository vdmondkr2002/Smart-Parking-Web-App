const express = require('express')
const router = express.Router()

const {signUp,sendOTP} = require('../controllers/users')

router.post('/signUp',signUp)
router.post('/sendOTP',sendOTP)

module.exports = router