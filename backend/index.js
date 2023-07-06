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
