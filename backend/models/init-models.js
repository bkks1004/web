var DataTypes = require("sequelize").DataTypes;
var _sequelizemeta = require("./sequelizemeta");
var _users = require("./users");

function initModels(sequelize) {
  var sequelizemeta = _sequelizemeta(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    sequelizemeta,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
