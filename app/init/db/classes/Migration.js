class Migration {
  constructor(props) {
    const { name, structure, db } = props;
    this.name = name;
    this.structure = structure;
    this.db = db;
  }

  compareColumns = (declared, db) => {
    const isNameCorrect = declared.field === db.Field;
    const isTypeCorrect = declared.type === db.Type;
    const isNullCorrect = declared.null === db.Null;
    const isKeyCorrect = declared.key === db.Key;
    const isDefaultCorrect = declared.default === db.Default;
    const isExtraCorrect = declared.extra === db.Extra;

    return isNameCorrect && isTypeCorrect && isNullCorrect && isKeyCorrect && isDefaultCorrect && isExtraCorrect;
  }

  isTableExists = async () => {
    console.log(`Check is table ${this.name} exists`);
    const isExists = await this.db.isTableExists(this.name);
    return isExists;
  }

  isTableStructureCorrect = async () => {
    console.log(`Check is table ${this.name} structure correct`);
    const structure = await this.db.getTableStructure(this.name);
    if (structure.length !== this.structure.length) return false;

    for (let i = 0; i < structure.length; i++) {
      const columnInDB = structure[i];
      const declaredColumn = this.structure[i];
      const compareResult = this.compareColumns(declaredColumn, columnInDB);
      if (!compareResult) return false;
    }

    return true;
  }

  dropWrongTable = async () => {
    console.log(`Drop table ${this.name} because it is wrong`);
    await this.db.dropTable(this.name);
  }

  createTable = async() => {
    await this.db.query(`CREATE TABLE(
      
    )`)
  }

  migrate = async () => {
    console.log(`Migrate table ${this.name}`)
    if (await this.isTableExists() && await this.isTableStructureCorrect()) {
      return true;
    } else {
      this.dropWrongTable();
      return false;
    }
  }
};

module.exports = Migration;

