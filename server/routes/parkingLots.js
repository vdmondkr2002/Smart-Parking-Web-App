const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {postParkingLot, getParkingLots,bookSlot, getBookedTimeSlots, cancelBookedSlot, deleteParkingLot} = require('../controllers/parkingLots')

/*Router indicates the mapping of url string with corresponding handler(controller) function*/

/*This route is designed to handle requests related to parkingLots such as 
adding new ones, finding free parking lots, getting booked slots for a user, cancelling a slot which has been booked previously */
router.post('',auth,postParkingLot)
router.get('',auth,getParkingLots)
router.get('/bookedSlots',auth,getBookedTimeSlots)
router.delete('/cancelSlot',auth,cancelBookedSlot)


module.exports = router