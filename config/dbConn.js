const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();
const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_TYPE,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
  }
);

module.exports = connection;
