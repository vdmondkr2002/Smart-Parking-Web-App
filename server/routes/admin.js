const express = require('express')
const { getUsersName, getUserHistory, getParkingLotsNear, getParkingLots, getParkingLotHistory, deleteParkingLot, createAdmin, makeActiveParkingLot, getCancelledSlots } = require('../controllers/admin')
const router = express.Router()
const auth = require('../middleware/auth')

//Those routes which require an authentication such as admin to access them have added auth as middleware

/*Router indicates the mapping of url string with corresponding handler(controller) function*/

/*
This router handle requests related to admin such as
getting users name and parking lot names
when admin selects particular one show the details for that parking lot or user
make a particular parking lot inactive or make it active again
*/
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