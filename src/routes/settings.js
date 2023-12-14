const express = require('express')
const router = express.Router()

const SettingsController = require('../app/controllers/SettingsController')

router.get('/settings', SettingsController.settings)
router.post('/test', SettingsController.test)
router.post('/result', SettingsController.result)

module.exports = router
