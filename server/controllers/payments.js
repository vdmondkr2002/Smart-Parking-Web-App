const { instance } = require('../Utils/razorPayInstance')
const crypto = require('crypto')
const { bookSlotValidator } = require('../validators/joi-validator')
const User = require('../models/User')
const BookedTimeSlot = require('../models/BookedTimeSlot')
const mongoose = require('mongoose')
const Payment = require('../models/Payment')

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
        const user = await User.findById(req.userId)
        if (!user.profilePic) {
            return res.status(400).json({ msg: "Please Upload a profile photo first for verification" })
        }
        const storebookingStart = new Date(startTime).getTime()
        const storebookingEnd = new Date(endTime).getTime()
        const currTimeStamp = new Date(currTime).getTime()
        // const date = new Date()
        // console.log(new Date(startTime).getDate())
        if ((storebookingEnd - storebookingStart) <= 0) {
            return res.status(400).json({ msg: "Please Enter a Valid time frame" })
        } else if (storebookingStart < currTimeStamp) {
            return res.status(400).json({ msg: "Cannot book slot in past" })
        } else if (new Date(startTime).getDate() > new Date(currTime).getDate() + 1) {
            console.log("Helo")
            return res.status(400).json({ msg: "Cannot book a slot starting after next day" })
        } else if ((storebookingEnd - storebookingStart) / (1000 * 60 * 60) > 3) {
            return res.status(400).json({ msg: "Slot cannot be of more than three hours" })
        }

        const futureBookedParkingSlots = await BookedTimeSlot.find({
            endTime: {
                $gte: currTimeStamp
            },
            vehicleType: vehicleType,
            booker: req.userId,
            cancelled: false,
            paid: true
        })

        // console.log(futureBookedParkingSlots)
        if (futureBookedParkingSlots.length > 0) {
            return res.status(400).json({ msg: `You have already have booked a slot for a ${vehicleType}` })
        }

        const vehicleBookedSlots = await BookedTimeSlot.find({
            vehicleNo: vehicleNo,
            cancelled: false,
            paid: true,
            vehcileType:vehicleType,
            endTime:{
                $gte:currTimeStamp
            }
        })
        if (vehicleBookedSlots.length > 0) {
            return res.status(400).json({ msg: `This ${vehicleType} already has an active slot booked` })
        }



        const options = {
            amount: req.body.charges * 100, //amount in smallest currency unit
            currency: "INR",
            receipt: "order_receip_11"
        }
        const order = await instance.orders.create(options)

        console.log(order, "123")
        console.log(storebookingStart, storebookingEnd, mongoose.Types.ObjectId(slotId), mongoose.Types.ObjectId(lotId), req.userId,
            vehicleType, vehicleNo, cancellable, order.id)
        //slot created
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

exports.bookPaymentVerification = async (req, res) => {

    console.log(req.body)
    // const {lotId,slotId,startTime,endTime,vehicleType,carImg,vehicleNo,cancellable,charges} = req.query
    console.log(req.query)

    try {
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
            const bookedTimeSlot = await BookedTimeSlot.findOneAndUpdate({ orderID: razorpay_order_id }, { paid: true,paymentDetails:paymentDetails }, { new: true })
            console.log(bookedTimeSlot)
            await Payment.create({ orderID: razorpay_order_id, paymentID: razorpay_payment_id, sign: razorpay_signature })
            // return res.status(200).json({msg:"Verified","signatureIsValid":true})
            res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentSuccess?type=book`)
            return
        }
        res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentFailure?type=book`)
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}

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
            const bookedTimeSlot = await BookedTimeSlot.findByIdAndUpdate(req.query.slotID, { refunded: true,refundDetails:paymentDetails }, { new: true })
            console.log(bookedTimeSlot)
            await Payment.create({ orderID: razorpay_order_id, paymentID: razorpay_payment_id, sign: razorpay_signature,type:"refund" })
            // return res.status(200).json({msg:"Verified","signatureIsValid":true})
            res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentSuccess?type=refund`)
            return
        }
        res.redirect(`${process.env.REACT_APP_URL || "http://localhost:3000"}/paymentFailure?type=refund`)
        // const bookedTimeSlot = await BookedTimeSlot.findByIdAndUpdate(,{refunded:true})

        return res.status(200).json({success:true})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong"})
    }
}