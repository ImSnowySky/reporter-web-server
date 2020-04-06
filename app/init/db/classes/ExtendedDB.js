class ExtendedDB {
  constructor(connection) {
    this.connection = connection;
  }

  query = (query) => {
    if (!this.connection) throw Error('No DB connection');
    return new Promise((res, reject) => {
      this.connection.query(query, (error, results) => {
        if (error) reject(error);
        res(results);
      })
    })
  }

  isTableExists = async (tableName) => await this.query(`SHOW TABLES LIKE '${tableName}'`);
  getTableStructure = async (tableName) => await this.query(`SHOW COLUMNS FROM ${tableName}`);
  dropTable = async (tableName) => await this.query(`DROP TABLE ${tableName}`);
}

module.exports = ExtendedDB;