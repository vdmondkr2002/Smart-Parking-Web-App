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

const postParkingValidator = joi.object({
    parkName:joi.string().required(),
    noOfCarSlots:joi.string().required(),
    noOfBikeSlots:joi.string().required(),
    address:joi.string().required(),
    parkingChargesCar:joi.string().required(),
    parkingChargesBike:joi.string().required(),
    lat:joi.string().required(),
    lng:joi.string().required()
})

const getParkingValidator = joi.object({
    lat:joi.string().required(),
    lng:joi.string().required(),
    startTime:joi.string().required(),
    endTime:joi.string().required(),
    vehicleType:joi.string().required()
})

const bookSlotValidator = joi.object({
    slotId:joi.string().required(),
    lotId:joi.string().required(),
    startTime:joi.string().required(),
    endTime:joi.string().required(),
    vehicleType:joi.string().required()
})

const feedbackValidator = joi.object({
    firstName:joi.string().min(2).max(30).required(),
    lastName:joi.string().min(2).max(40).required(),
    country:joi.string().min(2).max(40).required(),
    feedback:joi.string().required()
})

const latLonValidator = joi.object({
    lat:joi.string().required(),
    lng:joi.string().required()
})
module.exports = {sendOTPValidator,loginValidator,verifyEmailValidator,postParkingValidator,getParkingValidator,bookSlotValidator,feedbackValidator,latLonValidator}