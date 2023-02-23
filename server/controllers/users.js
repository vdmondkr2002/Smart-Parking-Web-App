const { sendOTPValidator } = require("../validators/joi-validator")
const User = require('../models/User')
const { generateOTP } = require("../Utils/generateOTP")
const bcrypt = require('bcryptjs')
const sendEmail = require('../Utils/sendEmail')

const createUser = async(formData)=>{
    
    console.log("in create user")
    try{
    
        //Get the hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(formData.password,salt)
        console.log("re")
        //generate otp
        const otpGenerated = generateOTP();

        console.log("otp generated",otpGenerated)
        //save the user in database

        const newUser = await User.create({
            email:formData.email,password:hashedPassword,
            firstName:formData.firstName,lastName:formData.lastName,
            userName:formData.lastName,mobileNo:formData.mobileNo,
            createdAt:new Date().toISOString(),
            otp:otpGenerated
        })

        if (!newUser) {
            console.log("Here")
            return {badMsg:"Unable To Sign Up"}
        }

        const subject = "[Smart Parking] Welcome smart parker"
        const html = `
        <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <h2>Welcome to the club</h2>
            <h4> You are just one step away from becoming a smart parker</h4>
            <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otpGenerated}</h1>
            <h5>If you haven't made this request. simply ignore the mail and no changes will be made</h5>
        </div>`
        const receiverMail = formData.email

        await sendEmail({html,subject,receiverMail})

        return {goodMsg:"Created user"}
    }catch(err){
        return {badMsg:"Failed to create"}
    }
    
}
exports.signUp = async(req,res)=>{
    console.log("request received")
    return res.status(200).send({msg:"Success"})
}

exports.sendOTP = async(req,res)=>{
    console.log(req.body)
    req.body.otp="1"
    const {error} = sendOTPValidator.validate(req.body);
    console.log(error)
    try{
        
        if(error)
            return res.status(400).json({msg:error.details[0].message})
        
        const {email,password,confirmPassword} = req.body

        const existingUser = await User.findOne({email:email})

        //if user already exists simply return
        if(existingUser){
            return res.status(400).json({msg:"User already exists"})
        }

        //if user doesn't exist create new one and send otp for its verification
        
        //check whether both passwords are same
        if(password !== confirmPassword){
            console.log("No match")
            return res.status(400).json({msg:"Password don't match"})
        }

        // const newUser = await createUser(req.body)
        
        // if(newUser.badMsg){
        //     return res.status(500).json({msg:"Unable to sign up please try again later"})
        // }

        return res.status(200).json({msg:"OTP Sent to your email id"})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong.."})
    }
}