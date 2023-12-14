const express = require('express')
const router = express.Router()

const HomeController = require('../app/controllers/HomeController')

router.get('/', HomeController.index)
router.get('/welcome', HomeController.welcome)
// router.get('/test', HomeController.test)
router.get('/result', HomeController.result)

module.exports = router
