var DataTypes = require('sequelize').DataTypes
var _sequelizemeta = require('./sequelizemeta')
var _snsInfo = require('./snsInfo')
var _user = require('./user')

function initModels(sequelize) {
  var sequelizemeta = _sequelizemeta(sequelize, DataTypes)
  var snsInfo = _snsInfo(sequelize, DataTypes)
  var user = _user(sequelize, DataTypes)

  snsInfo.belongsTo(user, { as: 'as_sns_id', foreignKey: 'sns_id' })
  user.hasMany(snsInfo, { as: 'as_sns_id', foreignKey: 'sns_id' })

  return {
    sequelizemeta,
    snsInfo,
    user,
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
