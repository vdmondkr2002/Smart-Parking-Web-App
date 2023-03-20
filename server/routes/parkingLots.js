const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {postParkingLot, getParkingLots,bookSlot, getBookedTimeSlots, cancelBookedSlot, deleteParkingLot} = require('../controllers/parkingLots')


router.post('',auth,postParkingLot)
router.get('',auth,getParkingLots)
router.post('/book',auth,bookSlot)
router.get('/bookedSlots',auth,getBookedTimeSlots)
router.delete('/cancelSlot',auth,cancelBookedSlot)


module.exports = router