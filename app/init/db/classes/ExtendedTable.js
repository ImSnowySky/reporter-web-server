class ExtendedTable {
  constructor({ db, name }) {
    this.db = db;
    this.name = name;
  }

  query = async (query) => {
    if (!this.db.connection) throw Error('No DB connection');
    return await this.db.query(query);
  }

  select = async (where = null) =>
    await this.query(`SELECT * FROM ${this.name}${where ? ` WHERE ${where}` : ''}`);
}

module.exports = ExtendedTable;