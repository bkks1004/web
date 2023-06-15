var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  //   res.send('Hello!!! users')
  res.send({
    mid: 3,
    memberName: '오성',
  })
})

module.exports = router
