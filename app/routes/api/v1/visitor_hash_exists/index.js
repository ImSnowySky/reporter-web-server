const escapeObject = require('../../../../shared/escapeObject');

const methods = {
  get: async (request, db) => {
    const { hash } = request.query;
    if (!hash) throw Error ('No hash presented');
    const escapedInfo = escapeObject({ hash }, db);
    
    try {
      const result = await db.query(`SELECT hash FROM visitors WHERE hash=${escapedInfo.hash} LIMIT 1`);
      return { body: result && result.length && result.length > 0 };
    } catch(e) {
      throw Error(e);
    }
  },
};

module.exports = methods;