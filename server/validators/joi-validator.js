const joi = require('joi')

const sendOTPValidator = joi.object({
    firstName:joi.string().min(2).max(30).required(),
    lastName:joi.string().min(2).max(40).required(),
    userName:joi.string().min(5).max(30).required(),
    mobileNo:joi.string().length(10).pattern(/^[0-9]+$/).required(),
    email:joi.string().required().email(),
    password:joi.string().min(6).required(),
    confirmPassword:joi.string().min(6).required(),
    otp:joi.string().optional()
})

const loginValidator = joi.object({
    email:joi.string().required().email(),
    password:joi.string().min(6).required()
})

const verifyEmailValidator = joi.object({
    email:joi.string().required().email(),
    otp:joi.string().optional()
})

module.exports = {sendOTPValidator,loginValidator,verifyEmailValidator}