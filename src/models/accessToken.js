const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const AccessToken = sequelize.define(
  "accessToken",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
    },
    accessToken: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// accessToken.associate = function (models) {
//     accessToken.belongsTo(models.users, {
//         foreignKey: 'userId'
//     })
// };

module.exports = { AccessToken };
