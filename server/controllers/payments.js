const { instance } = require('../Utils/razorPayInstance')
const crypto = require('crypto')
const { bookSlotValidator } = require('../validators/joi-validator')
const User = require('../models/User')
const dayjs = require('dayjs')
const BookedTimeSlot = require('../models/BookedTimeSlot')
const mongoose = require('mongoose')
const Payment = require('../models/Payment')
const ParkingLot = require('../models/ParkingLot')
const sendEmail2 = require('../Utils/sendEmail2')


//tested
/*create the order of payment of the booking of slot*/
exports.checkoutBookSlot = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    const { error } = bookSlotValidator.validate(req.body)
    
    if(error){
        if(error.details[0].path[0]==='vehicleNo' && error.details[0].type==="string.pattern.base"){
            return res.status(400).json({ msg: "Please enter a valid Vehicle Number"})
        }
    }
    
    try {
        if (error) {
            return res.status(400).json({ msg: error.details[0].message })
        }
        const { lotId, slotId, startTime, endTime, vehicleType, carImg, vehicleNo, cancellable, charges,type,currTime } = req.body
        console.log(lotId, slotId, startTime, endTime, vehicleType, vehicleNo, cancellable, charges,type,currTime)


        //get the user profilepic
        const user = await User.findById(req.userId,{profilePic:1})
        
        //if doesn't has a profilePic, it is not allowed to book slot
        if (!user.profilePic) {
            return res.status(400).json({ msg: "Please Upload a profile photo first for verification" })
        }
        console.log("profile pic checked")
        //get timeStamp
        const storebookingStart = new Date(startTime).getTime()
        const storebookingEnd = new Date(endTime).getTime()
        const currTimeStamp = new Date(currTime).getTime()

        //get active bookings by the user for the vehicleType
        //i.e. whose endTime is greater than equal to currTimeStamp
        const futureBookedParkingSlots = await BookedTimeSlot.find({
            endTime: {
                $gte: currTimeStamp
            },
            vehicleType: vehicleType,
            booker: req.userId,
            cancelled: false,
            paid: true
        })
        //if any active bookings found
        if (futureBookedParkingSlots.length > 0) {
            return res.status(400).json({ msg: `You have already have booked a slot for a ${vehicleType}` })
        }
        console.log("already booked slot checked")

        //get all of active booked slot for this vehicleNo
       
        const vehicleBookedSlots = await BookedTimeSlot.find({
            vehicleNo: vehicleNo,
            cancelled: false,
            paid: true,
            vehcileType:vehicleType,
            endTime:{
                $gte:currTimeStamp
            }
        })

        //if this vehicleNo has an active slot then isn't allowed to book
        if (vehicleBookedSlots.length > 0) {
            return res.status(400).json({ msg: `This vehicle Number ${vehicleNo} already has an active slot booked` })
        }

        console.log("vehicle no slot checked")

        if(type==="private"){
            //create an order with the amount as charge 
            const options = {
                amount: req.body.charges * 100, //amount in smallest currency unit
                currency: "INR",
                receipt: "order_receip_11"
            }
            const order = await instance.orders.create(options)
            console.log(order)
            console.log(storebookingStart, storebookingEnd, mongoose.Types.ObjectId(slotId), mongoose.Types.ObjectId(lotId), req.userId,
            vehicleType, vehicleNo, cancellable, order.id)
        
            //save the bookedSlot in db
            const bookedSlot = await BookedTimeSlot.create({
                startTime: storebookingStart, endTime: storebookingEnd, parkingSlot: mongoose.Types.ObjectId(slotId),
                parkingLot: mongoose.Types.ObjectId(lotId), booker: req.userId, vehicleType: vehicleType,
                carImage: carImg, vehicleNo: vehicleNo, cancellable: cancellable, orderID: order.id, paid: false
            })
            return res.status(200).json({ msg: "Payment order created", order })
        }else{
            const bookedSlot = await BookedTimeSlot.create({
                startTime: storebookingStart, endTime: storebookingEnd, parkingSlot: mongoose.Types.ObjectId(slotId),
                parkingLot: mongoose.Types.ObjectId(lotId), booker: req.userId, vehicleType: vehicleType,
                carImage: carImg, vehicleNo: vehicleNo, cancellable: cancellable, paid: true
            })
            console.log("bookedSlot")
            return res.status(200).json({ msg: "Slot Booking Successful" })
        }
        
        

        
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}


//tested
/* verify the payment done by the user for the order created*/
exports.bookPaymentVerification = async (req, res) => {

    console.log(req.body)
    const {charges} = req.query
    try {
        //get the orderID, paymentID and sign
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        //check if after the hashing of  orderID|paymentID with key as secret
        //the sign we get is it same as sign we have
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest('hex')

        

        console.log('sign received', razorpay_signature)
        console.log('sign generated', expectedSign)

        //if both signs are same the payment done by user is valid
        if (expectedSign === razorpay_signature) {
            //fetch the details of payment using razorpay api
            const paymentDetails = await instance.payments.fetch(razorpay_payment_id)
            console.log("got payment details")

            //update the bookedSlot with orderID as this with paid as true and also save the paymentDetails
            const bookedTimeSlot = await BookedTimeSlot.findOneAndUpdate({ orderID: razorpay_order_id }, { paid: true,paymentDetails:paymentDetails }, { new: true })
            
            console.log("got booked time slot")
            //save three attributes in diff database
            await Payment.create({ orderID: razorpay_order_id, paymentID: razorpay_payment_id, sign: razorpay_signature })
            console.log(charges)
            
            const parkingLot = await ParkingLot.findById(bookedTimeSlot.parkingLot,{lotImages:0})
            console.log("got lot")
            if(parkingLot.type==="private"){
                
                const subject = '[Smart Parker] New Booking At Parking Lot'
                const html = `
                Dear ${parkingLot.ownerName},
                    New Booking At Your Parking Lot ${parkingLot.name}, for a ${bookedTimeSlot.vehicleType} with number ${bookedTimeSlot.vehicleNo} between ${dayjs(bookedTimeSlot.startTime).format('DD MMM hh:00 A')} and ${dayjs(bookedTimeSlot.endTime).format('DD MMM hh:00 A')}. 
                    You have paid the charges for this parking you booked ${charges}.
                From,
                Smart Parking Team`
                const receiverMail = parkingLot.ownerEmail
                await sendEmail2({html,subject,receiverMail})
            }
            
            //redirect user to paymentSuccess page
            res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentSuccess?type=book`)
            return
        }
        //if both signs are not the same the payment done by user is invalid
        //redirect user to payment failure page
        res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentFailure?type=book`)
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}


//tested 
/*send the razorpay key to frontend*/
exports.getRazorPayKey = async (req, res) => {
    try {
        return res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}


exports.checkoutRefund = async(req,res)=>{
    try{
        console.log(req.body)
        const options = {
            amount: req.body.amount * 100, //amount in smallest currency unit
            currency: "INR",
            receipt: "order_receip_11"
        }
        const order = await instance.orders.create(options)
        // const order = instance.payments.refund(order_LWvhUjAaRpdsrX)
        console.log(order, "123")
        return res.status(200).json({msg:"Refund order created",order:order})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong"})
    }
}


exports.refundPaymentVerification = async(req,res)=>{
    console.log(req.query)
    try{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest('hex')

        const paymentDetails = await instance.payments.fetch(razorpay_payment_id)
        console.log(paymentDetails)

        console.log('sign received', razorpay_signature)
        console.log('sign generated', expectedSign)

        if (expectedSign === razorpay_signature) {
            //mark the bookedSlot as refunded and save the refundDetails
            const bookedTimeSlot = await BookedTimeSlot.findByIdAndUpdate(req.query.slotID, { refunded: true,refundDetails:paymentDetails }, { new: true })
            const parkingLot = await ParkingLot.findById(bookedTimeSlot.parkingLot,{
                ownerName:1,name:1
            })
            //save the payment details
            await Payment.create({ orderID: razorpay_order_id, paymentID: razorpay_payment_id, sign: razorpay_signature,type:"refund" })
            
            const subject = '[Smart Parker] Your Refund For Booking Cancellation'
            console.log("now html creating")
            console.log(req.query.userName)
            console.log(parkingLot.name)
            console.log(bookedTimeSlot.vehicleType)
            console.log(req.query.charges)
            console.log(bookedTimeSlot.adminCancelled)
            console.log(req.query.emailID)
            console.log(bookedTimeSlot.startTime)
            const html = `
            Dear ${req.query.userName},
                    Refund for Your Booking Cancellation, at Parking Lot ${parkingLot.name}, for a ${bookedTimeSlot.vehicleType} with number ${bookedTimeSlot.vehicleNo} between ${dayjs(bookedTimeSlot.startTime).format('DD MMM hh:00 A')} and ${dayjs(bookedTimeSlot.endTime).format('DD MMM hh:00 A')}. 
                    The charges for this parking you booked ${req.query.charges}, ${bookedTimeSlot.adminCancelled?`100% is refunded`:`70% i.e.${(req.query.charges*0.7).toFixed(2)} is refunded`} to your account
                From,
                Smart Parking Team
            `
            const receiverMail = req.query.emailID
            console.log("sending mail")
            await sendEmail2({subject,html,receiverMail})
            res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentSuccess?type=refund`)
            return
        }
        res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentFailure?type=refund`)
       
        return res.status(200).json({success:true})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong"})
    }
}