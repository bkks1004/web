const SequelizeAuto = require('sequelize-auto')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('./config/config')[env]
// 이거 하면 init-models도 수정 됨.
const auto = new SequelizeAuto(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    directory: './models',
    port: 3306,
    caseModel: 'c', // convert snake_case column names to camelCase field names: user_id -> userId
    caseFile: 'c', // file names created for each model use camelCase.js not snake_case.js
    // singularize: true, // convert plural table names to singular model names
  }
)
auto.run(err => {
  if (err) throw err
})
