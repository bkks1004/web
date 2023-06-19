const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../config/config')[env]
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
)
// const { initModels } = require('./init-models')
const db = {}

// Object.assign(db, initModels(sequelize))
db.Sequelize = Sequelize
db.sequelize = sequelize

module.exports = db
