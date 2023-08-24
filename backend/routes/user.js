const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.post('/', userController.registUser)

router.post('/login', userController.login)

router.post('/check-id-duplicate', userController.checkDuplicateId)

router.post('/email-auth', userController.sendMailAuth)

module.exports = router
