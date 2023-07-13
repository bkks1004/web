const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.get('/', (req, res) => {
  res.send('Hello!!! users')
  // res.send({
  //   mid: 3,
  //   memberName: '오성',
  // })
})

router.post(
  '/',
  userController.createUser
  // console.log(id, password)
)

router.post('/email-auth', userController.sendMailAuth)

module.exports = router
