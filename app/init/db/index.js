const dbConfig = require('../../../config/db');
const ExtendedDB = require('./classes/ExtendedDB');
const mysql = require('mysql');

let connection = null;

const getDBConnection = () => {
  if (!connection) {
    connection = mysql.createConnection(dbConfig);
  }
  return connection;
};

const getExtendedDB = (dbConnection = getDBConnection()) => new ExtendedDB(dbConnection);
const createDB = async (db = getExtendedDB()) => db;
module.exports = createDB;