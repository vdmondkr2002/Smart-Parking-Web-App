const express = require('express')
const { getNews } = require('../controllers/news')
const router = express.Router()

router.get('',getNews)

module.exports = router