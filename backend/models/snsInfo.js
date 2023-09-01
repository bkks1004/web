const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('snsInfo', {
    sns_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    sns_type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    sns_connect_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'sns_info',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sns_id" },
        ]
      },
      {
        name: "sns_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sns_id" },
          { name: "sns_type" },
        ]
      },
    ]
  });
};
