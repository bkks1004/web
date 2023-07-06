var DataTypes = require("sequelize").DataTypes;
var _sequelizemeta = require("./sequelizemeta");
var _user = require("./user");

function initModels(sequelize) {
  var sequelizemeta = _sequelizemeta(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);


  return {
    sequelizemeta,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
