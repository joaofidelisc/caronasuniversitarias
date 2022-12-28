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

module.exports = sequelize;