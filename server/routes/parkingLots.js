const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {postParkingLot, getParkingLots,bookSlot} = require('../controllers/parkingLots')


router.post('',auth,postParkingLot)
router.get('',auth,getParkingLots)
router.post('/book',auth,bookSlot)

module.exports = router