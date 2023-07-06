// CORS를 구성하고, Express를 초기화 및 Sequelize 연결, 서버 연결을 담당합니다.
// https://kyounghwan01.github.io/blog/etc/sequelize/sequlize-basic-example/#express-%E1%84%8B%E1%85%B0%E1%86%B8-%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5-%E1%84%8E%E1%85%AE%E1%84%80%E1%85%A1
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
// const bodyParser = require('body-parser') // 이거 이제 안써도 될껄???
/** 쓴다면 이거 추가해
 * app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 */
const cors = require('cors')
const { sequelize } = require('./models/index')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')

const app = express()

const corsOptions = {
  origin: 'http://localhost:9000',
}

sequelize
  .sync({ force: false }) // 서버 실행시마다 테이블 재생성할건지 여부
  .then(() => {
    console.log('DB Connect success')
  })
  .catch(err => {
    console.error(err)
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors(corsOptions)) // 설정한 도메인에서 제한 없이 해당 서버에 요청을 보내고 응답을 받을 수 있다.

app.use('/', indexRouter)
app.use('/user', userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
