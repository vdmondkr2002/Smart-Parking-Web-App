const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {postParkingLot, getParkingLots} = require('../controllers/parkingLots')


router.post('',auth,postParkingLot)
router.get('',getParkingLots)

module.exports = router