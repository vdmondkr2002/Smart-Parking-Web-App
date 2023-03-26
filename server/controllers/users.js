const { sendOTPValidator, verifyEmailValidator, loginValidator, feedbackValidator, resetMailValidator, resetPassValidator } = require("../validators/joi-validator")
const User = require('../models/User')
const { generateOTP } = require("../Utils/generateOTP")
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const sendEmail = require('../Utils/sendEmail')
const sendEmail2 = require('../Utils/sendEmail2')
const webpush = require('web-push')
const { instance } = require("../Utils/razorPayInstance")


exports.sendOTP = async (req, res) => {
    req.body.otp = "1"
    const { error } = sendOTPValidator.validate(req.body);
    console.log(error)
    try {

        if (error)
            return res.status(400).json({ msg: error.details[0].message })

        const { email, password, confirmPassword,firstName,lastName,userName,mobileNo,selectedImg,currTimeStamp } = req.body


        //find existing user
        const existingUser = await User.findOne({ email: email })

        //if user already exists simply return
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" })
        }

        //if user doesn't exist create new one and send otp for its verification

        //check whether both passwords are same
        if (password !== confirmPassword) {
            console.log("No match")
            return res.status(400).json({ msg: "Password don't match" })
        }   
        console.log(password)
        const hashedPassword = passwordHash.generate(password)
        console.log(hashedPassword)
        //generate otp
        const otpGenerated = generateOTP();

        console.log("otp generated", otpGenerated)
        //save the user in database

        //User creation
        const newUser = await User.create({
            email: email, password: hashedPassword,
            firstName: firstName, lastName: lastName,
            userName:userName, mobileNo: mobileNo,
            profilePic: selectedImg,
            createdAt: new Date(currTimeStamp).toISOString(),
            otp: otpGenerated
        })
        console.log(newUser.email)
        if (!newUser) {
            return res.status(500).json({ msg: "Unable to sign up please try again later" })
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
        const receiverMail =email

        await sendEmail2({ html, subject, receiverMail })
        return res.status(200).json({ msg: "Account Created, Verify OTP Sent to your email id to access your account" })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.resendOTP = async(req,res)=>{
    console.log(req.body)

    try{
        if(!req.body.email){
            return res.status(200).json({msg:"Please enter email"})
        }

        const existingUser = await User.findOne({ email: req.body.email })

        //if user already exists simply return
        if (!existingUser) {
            return res.status(400).json({ msg: "No account with this email ID, Create an Account first" })
        }else if(existingUser.verified){
            return res.status(200).json({msg: "You are already verified, you can login directly"})
        }

       //generate otp
       const otpGenerated = generateOTP();

       console.log("otp generated", otpGenerated)

       if(!otpGenerated){
        return res.status(400).json({msg:"Error in generating OTP"})
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
        const receiverMail = req.body.email

        

        await sendEmail2({html,subject,receiverMail})
        await User.findByIdAndUpdate(existingUser._id,{otp:otpGenerated})
        
        return res.status(200).json({msg:"Vefiy OTP sent to your email To Access Your Account"})

    }catch(err){
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

const validateUserSignUp = async (email, otp) => {
    const user = await User.findOne({ email })
    console.log(user)
    if (!user) {
        return { badMsg: "Send OTP first" }
    }
    console.log(user.otp, " and ", otp)
    if (user && user.otp !== otp) {
        console.log("invalid otp")
        return { badMsg: "Invalid OTP" }
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        $set: { verified: true },
    })

    return { goodMsg: "You're Registered Successfully, Login Now" }
}
exports.verifyEmail = async (req, res) => {
    console.log(req.body)

    const { error } = verifyEmailValidator.validate(req.body);

    try {
        const { email, otp } = req.body;

        const user = await validateUserSignUp(email, otp)

        if (user.badMsg) {
            return res.status(400).json({ msg: user.badMsg })
        }

        return res.status(200).json({ msg: user.goodMsg })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body
    const { error } = loginValidator.validate({ email, password })
    console.log(email, password)
    console.log(error)
    try {
        if (error)
            return res.status(400).json({ msg: error.details[0].message })

        //Check email
        const oldUser = await User.findOne({ email: email })
        if (!oldUser)
            return res.status(404).json({ msg: "User doesn't exist" })
        console.log(oldUser)
        if (!oldUser.verified)
            return res.status(400).json({ msg: "Please verify your account first! Check the otp sent on mail during registration" })
        
        console.log(new Date(1679838284981))
        //Check passowrd
        // const isMatch = await bcrypt.compare(password, oldUser.password)
        const isMatch = passwordHash.verify(password,oldUser.password)
        
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" })
        console.log("password matched")
        const payload = {
            email: oldUser.email,
            id: oldUser._id
        }



        const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "3h" })
        console.log(token)
        console.log("token signed")
        return res.status(200).json(token)
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }

}


exports.getCurrentUser = async (req, res) => {
    console.log("loading user")
    try {
        if (!req.userId) {
            return res.status(401).json({ msg: "Unauthorized" })
        }
        
        const user = await User.findById(req.userId)
        // console.log("User->", user)
        return res.status(200).json({ firstName: user.firstName, lastName: user.lastName, userName: user.userName, _id: user._id, email: user.email, mobileNo: user.mobileNo, role: user.role, profilePic: user.profilePic })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.sendFeedback = async (req, res) => {
    const { error } = feedbackValidator.validate(req.body)
    console.log(req.body)
    try {
        if (error) {
            return res.status(400).json({ msg: error.details[0].message, severity: "error" })
        }

        const receiverMail = 'smartparking678@gmail.com'
        const html = `<div
                        class="container"
                        style="max-width: 90%; margin: auto; padding-top: 20px"
                    >${req.body.feedback}</div>`;
        const subject = `Feedback from ${req.body.firstName} ${req.body.lastName}`

        await sendEmail2({ html, subject, receiverMail })

        return res.status(200).json({ msg: "Feedback submit successfully" })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.setProfilePic = async (req, res) => {
    if (!req.userId)
        return res.status(401).json({ msg: "Unauthorized" })

    try {

        if (!req.body.selectedImg) {
            return res.status(400).json({ msg: "Please upload a picture first" })
        }


        const { selectedImg } = req.body


        const updatedUser = await User.findOneAndUpdate({ _id: req.userId }, { profilePic: selectedImg }, { new: true })
        return res.status(200).json({ msg: "Profile image updated succesfully" })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.sendSubcription = async (req, res) => {
    if (!req.userId) {
        return res.status(201).json({ msg: "Unauthorized" })
    }
    try {
        console.log(req.body)
        const subcriptionData = req.body;
        console.log(subcriptionData)
        // const payload = JSON.stringify({
        //     title:'Helo',
        //     body:"It's working now"
        // })
        const updatedUser = await User.findOneAndUpdate({ _id: req.userId }, { subscription: subcriptionData }, { new: true })
        // const result = await webpush.sendNotification(subcription,payload)

        // console.log(result)
        return res.status(200).json({ 'success': true })
    } catch (e) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.sendResetEmail = async (req, res) => {
    const { error } = resetMailValidator.validate(req.body)
    try {
        if (error)
            return res.status(400).json({ msg: error.details[0].message })

        const currUser = await User.findOne({ email: req.body.email })
        if (!currUser.email) {
            return res.status(404).json({ msg: "No user exists with this email, create an account first" })
        }

        const payload = {
            email: currUser.email,
            id: currUser._id
        }

        const resetCode = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "30m" })
        const subject = "[Smart Parker] Link to Reset Your Password"

        const html = `
        <div
                        class="container"
                        style="max-width: 90%; margin: auto; padding-top: 20px"
                    >
                        <h3>To reset Your password follow the link below:</h3>
                        <div>
                            <a href="${process.env.REACT_APP_URL || "http://localhost:3000"}/resetPassword/${resetCode}">Reset Your password</a>
                        </div>
                        <h5>If you haven't made this request. simply ignore the mail and no changes will be made</h5>
                    </div>
        `
        const receiverMail = req.body.email

        console.log(receiverMail)
        await sendEmail2({ html, subject, receiverMail })
        return res.status(200).json({ msg: "Mail sent with link to reset Your password" })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.resetPassword = async (req, res) => {
    const { error } = resetPassValidator.validate(req.body)
    try {
        if (error)
            return res.status(400).json({ msg: error.details[0].message })

        const {code,confirmPassword,password,currTimeStamp} = req.body
        console.log(req.body)
        if (password !== confirmPassword) {
            console.log("No match")
            return res.status(400).json({ msg: "Password don't match" })
        }

        const decodedData = jwt.decode(code)

        if(decodedData.exp*1000<currTimeStamp){
            return res.status(400).json({msg:"Expired code"})
        }

        // const salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(password,salt)
        const hashedPassword = passwordHash.generate(password)
        await User.findByIdAndUpdate(decodedData.id,{password:hashedPassword})

        return res.status(200).json({msg:"Password reset successfully, you can login now with new password!"})
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}