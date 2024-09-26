const express = require('express')
const {getData,getWeb,getAction,getDataForSwagger} = require('../controllers/homeControllers')
const router = express.Router()

//Đinh tuyến API

router.get('/api', getData)

//Định tuyến API Status
router.get('/api/action-history', getAction)


//Định tuyến Web page chính
router.get('/', getWeb)

module.exports = router