const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  username: "root",
  password: "root",
  host: "localhost",
  dialect: "mysql",
  database: "portal",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (err) {
    console.log("Unable to connect to the database");
  }
};

module.exports = {
  connectDB,
  sequelize,
};
