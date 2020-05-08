const escapeObject = require('../../../../../shared/escapeObject');
const getAuthToken = require('../../../../../shared/getAuthToken');
const isTokenCorrect = require('../../user/token_correct')['get']; 

const methods = {
  get: async (request, db) => {
    const token = getAuthToken(request);
    if (!token) return { status: 'Error', body: 'NO_AUTH' }

    const tokenCorrect = await isTokenCorrect(request, db).then(res => !!res.body);
    if (!tokenCorrect) return { status: 'Error', body: 'NO_AUTH' };

    const { from = null, to = null, withError = false, limit = null } = request.query;
    const info = escapeObject({ from, to }, db);

    try {
      const results = await db.query(`
        SELECT 
          visitors.id, visitors.hash, visitors.platform,
          visitors.os, visitors.os_version, visitors.browser,
          visitors.browser_version, visitors.user_agent, COUNT(*) AS errors_count,
          visitors.session_start
        FROM visitors
        LEFT JOIN visitor_event ON visitor_event.visitor_id = visitors.id
        WHERE
          ${withError ? "visitor_event.event_type = 'error'" : 'TRUE'}
          ${from ? `AND visitors.session_start >= ${info.from}` : ''}
          ${to ? `AND visitors.session_start <= ${info.to}` : ''}
        GROUP BY id
        ORDER BY id DESC
        ${limit && !Number.isNaN(parseInt(limit)) ? `LIMIT ${parseInt(limit)}` : ''}
      `);

      if (results.length === 0) return { body: [] };

      const resultsAsObject = results
        .map(result => ({
          id: result.id,
          hash: result.hash,
          platform: result.platform,
          os: {
           name: result.os,
           version: result.os_version,
          },
          browser: {
            name: result.browser,
            version: result.browser_version,
          },
          user_agent: result.user_agent,
          error_count: result.error_count,
          session_start: result.session_start,
        }))

      return { body: resultsAsObject };
    } catch (e) {
      throw Error(e);
    }
  },
};

module.exports = methods;