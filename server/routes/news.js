const express = require('express')
const { getNews } = require('../controllers/news')
const router = express.Router()

/*Router indicates the mapping of url string with corresponding handler(controller) function*/

/* This route is designed to handle requests related to news such as getting news from  third party api*/
router.get('',getNews)

module.exports = router