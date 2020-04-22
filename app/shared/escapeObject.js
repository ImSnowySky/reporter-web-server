const escapeObject = (obj, db) => {
  const escapedObject = { };
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    escapedObject[key] = db.connection.escape(value);
  });

  return escapedObject;
};

module.exports = escapeObject;