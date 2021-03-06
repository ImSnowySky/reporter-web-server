const escapeObject = require('../../../../../shared/escapeObject');
const getAuthToken = require('../../../../../shared/getAuthToken');

const methods = {
  get: async (request, db) => {
    const token = getAuthToken(request);
    if (!token) return { body: false }
    const escapedInfo = escapeObject({ token }, db);
    
    try {
      const result = await db.query(`SELECT id, name, token_active_for FROM users WHERE access_token=${escapedInfo.token} LIMIT 1`);
      if (result.length === 0) return { body: false };
      const expDate = +new Date(result[0].token_active_for);
      const currentDate = +new Date();      

      if (currentDate >= expDate) {
        await db.query(`UPDATE users SET access_token=null, token_active_for=null WHERE id = ${escapeObject({ id: result[0].id }, db).id}`);
      }
      return { body: currentDate < expDate ? result[0].name : false };
    } catch(e) {
      throw Error(e);
    }
  },
};

module.exports = methods;