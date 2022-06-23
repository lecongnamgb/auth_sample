const { sequelize } = require("../config/database");
const { DataTypes, Model } = require("sequelize");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "User",
  }
);

module.exports = User;
