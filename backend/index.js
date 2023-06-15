// CORS를 구성하고, Express를 초기화 및 Sequelize 연결, 서버 연결을 담당합니다.

const mysql = require('mysql')
const dbconfig = require('./config/db.config.js')
const app = require('./app.js')
const connection = mysql.createConnection(dbconfig)
const port = 3000

connection.connect(err => {
  if (err) throw err
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

// const mysql = require('mysql') // mysql 모듈 로드
// const connection = mysql.createConnection({
//   // mysql 접속 설정
//   host: '127.0.0.1', //   host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: 'test123',
//   database: 'my_db',
// })

// connection.connect()

// connection.query('SELECT * from users', (error, rows, fields) => {
//   if (error) throw error
//   console.log('user info is: ', rows)
// })

// connection.end()
