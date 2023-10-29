const express = require('express')
const router = express.Router()
const { checkAccessToken, checkRefreshToken } = require('../middlewares/auth')
const userController = require('../controllers/user.controller')

router.get('/', checkAccessToken, userController.getUserInfo)

router.put('/', userController.updateUser)

router.get('/check-refesh-token', checkRefreshToken)

router.post('/join', userController.registUser)

router.post('/login', userController.login)

router.post('/check-id-duplicate', userController.checkDuplicateId)

router.post('/email-auth', userController.sendMailAuth)

router.get('/sns/check-id', userController.checkSnsId)

router.get('/oauth/naver', userController.getNaverToken)

module.exports = router
