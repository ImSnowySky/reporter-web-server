const logger = require('../../../../app/shared/logger');
const ExtendedTable = require('./ExtendedTable');

class ExtendedDB {
  constructor(connection) {
    this.connection = connection;
  }

  getTable = async (name) => {
    const tablesWithName = await this.query(`SHOW TABLES LIKE '${name}'`);
    if (tablesWithName && tablesWithName.length > 0) {
      return new ExtendedTable({ db: this, name });
    }
    else throw Error(`No table with name ${name} founded`);
  }

  query = (query) => {
    if (!this.connection) throw Error('No DB connection');
    logger.MYSQL_QUERY(query);
    return new Promise((res, reject) => {
      this.connection.query(query, (error, results) => {
        if (error) reject(error);
        res(results);
      })
    })
  }
}

module.exports = ExtendedDB;