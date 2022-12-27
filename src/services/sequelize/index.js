// import { Sequelize } from "sequelize";
// import dbConfig from "../mysql-config/db.config.js";

const Sequelize = require('sequelize');
const dbConfig = require('../mysql-config/db.config.js');

const dbName = dbConfig.DB;
const dbUser = dbConfig.USER;
const dbHost = dbConfig.HOST;
const dbPassword = dbConfig.PASSWORD;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    dialect: "mysql",
    host: dbHost,
});


// export default sequelize;
module.exports = sequelize;