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
        //hash the password before storing it in database
        const hashedPassword = passwordHash.generate(password)
        
        //generate otp
        const otpGenerated = generateOTP();

        console.log("otp generated", otpGenerated)

        //save the user in database 
        //User creation (currently unverified)
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

        //send the otp to user for verification
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

        //check if the user already exists
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

       //send email to user with otp
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

        //store otp in user schema
        await User.findByIdAndUpdate(existingUser._id,{otp:otpGenerated})
        
        return res.status(200).json({msg:"Vefiy OTP sent to your email To Access Your Account"})

    }catch(err){
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.verifyEmail = async (req, res) => {
    console.log(req.body)

    const { error } = verifyEmailValidator.validate(req.body);

    try {
        const { email, otp } = req.body;

        //check if user even exists or not
        const user = await User.findOne({ email })
       
        if (!user) {
            return res.status(400).json({ msg: "Fill all the details first" })
        }
        console.log(user.otp, " and ", otp)
        //check if received and generated otp's are same
        if (user && user.otp !== otp) {
            return res.status(400).json({ msg: "Invalid OTP" })
        }

        //updating user as verified
        const updatedUser = await User.findByIdAndUpdate(user._id, { verified: true })

        return res.status(200).json({ msg: "You're Registered Successfully, Login Now"  })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body
    const { error } = loginValidator.validate({ email, password })
    console.log(error)
    try {
        if (error)
            return res.status(400).json({ msg: error.details[0].message })

        //check if user with this email even exists
        const oldUser = await User.findOne({ email: email })
        //if no user exists
        if (!oldUser)
            return res.status(404).json({ msg: "User doesn't exist" })
        
        //if user not verified tell to verify first
        if (!oldUser.verified)
            return res.status(400).json({ msg: "Please verify your account first! Check the otp sent on mail during registration" })
        
        //Verify if passowrd is correct
        const isMatch = passwordHash.verify(password,oldUser.password)
        
        //if password doesn't match
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" })
        console.log("password matched")
        
        //sign a token for user to login into his account and send it frontend where token will be stored in localstorage
        const payload = {
            email: oldUser.email,
            id: oldUser._id
        }
        const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "3h" })
        
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
        
        //load the user from id and send to frontend
        const user = await User.findById(req.userId)
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

        //send self email using the details
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

        ///update profilePic with selectedImg
        await User.findByIdAndUpdate(req.userId, { profilePic: req.body.selectedImg })
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
        
        //save the subscription data received in user schema
        const updatedUser = await User.findOneAndUpdate({ _id: req.userId }, { subscription: subcriptionData }, { new: true })
       
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

        //check if user exists with this email
        const currUser = await User.findOne({ email: req.body.email })
        if (!currUser.email) {
            return res.status(404).json({ msg: "No user exists with this email, create an account first" })
        }

        const payload = {
            email: currUser.email,
            id: currUser._id
        }
        //create a token to authrize user to reset password
        const resetCode = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "30m" })
        const subject = "[Smart Parker] Link to Reset Your Password"

        //send email to user with the code appended to link
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

//when user clicks on the link sent to reset password and fill new password and sends requests
exports.resetPassword = async (req, res) => {
    const { error } = resetPassValidator.validate(req.body)
    try {
        if (error)
            return res.status(400).json({ msg: error.details[0].message })

        const {code,confirmPassword,password,currTimeStamp} = req.body
    
        //check if passwords match
        if (password !== confirmPassword) {
            console.log("No match")
            return res.status(400).json({ msg: "Password don't match" })
        }

        //decode the token used
        const decodedData = jwt.decode(code)

        //if token is expired 
        if(decodedData.exp*1000<currTimeStamp){
            return res.status(400).json({msg:"Expired code, send an email again to get a new code"})
        }

        //hash the new password
        const hashedPassword = passwordHash.generate(password)

        //save the updated new password
        await User.findByIdAndUpdate(decodedData.id,{password:hashedPassword})

        return res.status(200).json({msg:"Password reset successfully, you can login now with new password!"})
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong.." })
    }
}