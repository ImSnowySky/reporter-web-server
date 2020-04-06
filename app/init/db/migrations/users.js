const Migration = require('../classes/Migration');

/*
CREATE TABLE `users` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` TINYTEXT NOT NULL,
	`password_hash` TEXT NOT NULL,
	UNIQUE INDEX `id` (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
*/

const structure = [{
  field: 'id',
  type: 'int(11) unsigned',
  null: 'NO',
  key: 'PRI',
  default: null,
  extra: 'auto_increment',
}, {
  field: 'name',
  type: 'tinytext',
  null: 'NO',
  key: '',
  default: null,
  extra: '',
}];

const migrateUsers = async(db) => {
  const migration = new Migration({
    db,
    structure,
    name: 'users',
  });

  const isCorrect = await migration.migrate();
  console.log(isCorrect);
}

module.exports = migrateUsers;