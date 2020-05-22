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
        SELECT user_info.*, COUNT(visitor_id) AS events_count FROM (
          SELECT 
            visitors.id, visitors.hash, visitors.ip, visitors.platform,
            visitors.os, visitors.os_version, visitors.browser,
            visitors.browser_version, visitors.user_agent,
            visitors.session_start,
            COUNT(b.visitor_id) AS errors_count
          FROM visitors
          LEFT JOIN
            (SELECT visitor_id, event_type FROM visitor_event) AS b ON b.visitor_id = visitors.id AND b.event_type = 'error'
          WHERE
            TRUE
            ${from ? `AND visitors.session_start >= ${info.from}` : ''}
            ${to ? `AND visitors.session_start <= ${info.to}` : ''}
          GROUP BY id
        ) AS user_info
        LEFT JOIN (SELECT visitor_id FROM visitor_event) AS c ON c.visitor_id = user_info.id
        WHERE ${withError ? 'user_info.errors_count > 0' : 'TRUE'} 
        GROUP BY id
        ORDER BY id DESC
        ${limit ? `LIMIT ${limit}` : ''}
      `);

      if (results.length === 0) return { body: [] };

      const resultsAsObject = results
        .map(result => ({
          id: result.id,
          hash: result.hash,
          ip: result.ip,
          platform: result.platform,
          os: {
           name: result.os,
           version: result.os_version,
          },
          browser: {
            name: result.browser,
            version: result.browser_version,
          },
          events_count: result.events_count,
          errors_count: result.errors_count,
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