const { instance } = require('../Utils/razorPayInstance')
const crypto = require('crypto')
const { bookSlotValidator } = require('../validators/joi-validator')
const User = require('../models/User')
const BookedTimeSlot = require('../models/BookedTimeSlot')
const mongoose = require('mongoose')
const Payment = require('../models/Payment')

//tested
/*create the order of payment of the booking of slot*/
exports.checkoutBookSlot = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    const { error } = bookSlotValidator.validate(req.body)
    try {
        if (error) {
            return res.status(400).json({ msg: error.details[0].message })
        }
        const { lotId, slotId, startTime, endTime, vehicleType, carImg, vehicleNo, cancellable, charges,currTime } = req.body
        console.log(lotId, slotId, startTime, endTime, vehicleType, vehicleNo, cancellable, charges,currTime)


        //get the user profilepic
        const user = await User.findById(req.userId,{profilePic:1})
        
        //if doesn't has a profilePic, it is not allowed to book slot
        if (!user.profilePic) {
            return res.status(400).json({ msg: "Please Upload a profile photo first for verification" })
        }

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
            return res.status(400).json({ msg: `This ${vehicleType} already has an active slot booked` })
        }

        //create an order with the amount as charge 
        const options = {
            amount: req.body.charges * 100, //amount in smallest currency unit
            currency: "INR",
            receipt: "order_receip_11"
        }
        const order = await instance.orders.create(options)

        console.log(storebookingStart, storebookingEnd, mongoose.Types.ObjectId(slotId), mongoose.Types.ObjectId(lotId), req.userId,
            vehicleType, vehicleNo, cancellable, order.id)
        
        //save the bookedSlot in db
        const bookedSlot = await BookedTimeSlot.create({
            startTime: storebookingStart, endTime: storebookingEnd, parkingSlot: mongoose.Types.ObjectId(slotId),
            parkingLot: mongoose.Types.ObjectId(lotId), booker: req.userId, vehicleType: vehicleType,
            carImage: carImg, vehicleNo: vehicleNo, cancellable: cancellable, orderID: order.id, paid: false
        })

        console.log(order)
        return res.status(200).json({ msg: "Payment order created", order })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}


//tested
/* verify the payment done by the user for the order created*/
exports.bookPaymentVerification = async (req, res) => {

    console.log(req.body)

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
            console.log(paymentDetails)

            //update the bookedSlot with orderID as this with paid as true and also save the paymentDetails
            const bookedTimeSlot = await BookedTimeSlot.findOneAndUpdate({ orderID: razorpay_order_id }, { paid: true,paymentDetails:paymentDetails }, { new: true })
            
            //save three attributes in diff database
            await Payment.create({ orderID: razorpay_order_id, paymentID: razorpay_payment_id, sign: razorpay_signature })
            
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
        await instance.payments.refund()
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
            
            //save the payment details
            await Payment.create({ orderID: razorpay_order_id, paymentID: razorpay_payment_id, sign: razorpay_signature,type:"refund" })
            
            res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentSuccess?type=refund`)
            return
        }
        res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentFailure?type=refund`)
       
        return res.status(200).json({success:true})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong"})
    }
}