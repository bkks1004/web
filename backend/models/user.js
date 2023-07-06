const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment: "M\/F"
    },
    phone_number: {
      type: DataTypes.STRING(11),
      allowNull: true,
      comment: "-이 포함되지 않은 문자열"
    },
    year_of_birth: {
      type: DataTypes.STRING(4),
      allowNull: false,
      comment: "연(YYYY)"
    },
    birthday: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: "월-일(MM-DD)"
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
