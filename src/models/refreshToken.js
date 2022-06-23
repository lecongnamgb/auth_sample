const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const RefreshToken = sequelize.define(
  "refreshToken",
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
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = { RefreshToken };
