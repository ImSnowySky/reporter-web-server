const escapeObject = require('../../../../../shared/escapeObject');
const getAuthToken = require('../../../../../shared/getAuthToken');
const isTokenCorrect = require('../../user/token_correct')['get']; 

const methods = {
  get: async (request, db) => {
    const token = getAuthToken(request);
    if (!token) return { status: 'Error', body: 'NO_AUTH' }

    const tokenCorrect = await isTokenCorrect(request, db).then(res => !!res.body);
    if (!tokenCorrect) return { status: 'Error', body: 'NO_AUTH' };

    const { from = null, to = null, withError = false } = request.query;
    const info = escapeObject({ from, to }, db);

    try {
      const results = await db.query(`
        SELECT COUNT(*) AS count FROM visitor_event
        WHERE
          visitor_event.event_type = 'error'
          ${from ? `AND visitor_event.server_fired_at >= ${info.from}` : ''}
          ${to ? `AND visitor_event.server_fired_at <= ${info.to}` : ''}
      `);

      if (results.length === 0) return { body: 0 };
      return { body: results[0].count };
    } catch (e) {
      throw Error(e);
    }
  },
};

module.exports = methods;