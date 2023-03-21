const express = require('express')
const { getUsersName, getUserHistory, getParkingLotsNear, getParkingLots, getParkingLotHistory, deleteParkingLot, createAdmin, makeActiveParkingLot, getCancelledSlots } = require('../controllers/admin')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/users',auth,getUsersName)
router.get('/userHistory',auth,getUserHistory)
router.get('/parkingLotsNear',auth,getParkingLotsNear)
router.get('/parkingLots',auth,getParkingLots)
router.get('/parkingLotHistory',auth,getParkingLotHistory)
router.delete('/removeParkingLot',auth,deleteParkingLot)
router.post('/activeLot',auth,makeActiveParkingLot)
router.get('/cancelledSlots',auth,getCancelledSlots)
router.post('/createAdmin',createAdmin)


module.exports = router