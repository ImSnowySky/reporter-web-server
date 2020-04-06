const dbConfig = require('../../../config/db');
const ExtendedDB = require('./classes/ExtendedDB');
const mysql = require('mysql');
const migrateUsers = require('./migrations/users');

let connection = null;

const getDBConnection = () => {
  if (!connection) {
    connection = mysql.createConnection(dbConfig);
    connection.connect();
  }
  return connection;
};

const getExtendedDB = (dbConnection = getDBConnection()) => new ExtendedDB(dbConnection);

const createDB = async (db = getExtendedDB()) => {
  await migrateUsers(db);
  return db;
}

module.exports = createDB;