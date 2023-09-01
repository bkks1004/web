const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.post('/join', userController.registUser)

router.post('/login', userController.login)

router.post('/check-id-duplicate', userController.checkDuplicateId)

router.post('/email-auth', userController.sendMailAuth)

router.get('/sns/check-id', userController.checkSnsId)

router.post('/sns/join', userController.registSnsUser)

module.exports = router
