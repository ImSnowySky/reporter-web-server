const escapeObject = require('../../../../../shared/escapeObject');
const getAuthToken = require('../../../../../shared/getAuthToken');
const isTokenCorrect = require('../../user/token_correct')['get']; 

const methods = {
  get: async (request, db) => {
    const token = getAuthToken(request);
    if (!token) return { status: 'Error', body: 'NO_AUTH' }

    const tokenCorrect = await isTokenCorrect(request, db).then(res => !!res.body);
    if (!tokenCorrect) return { status: 'Error', body: 'NO_AUTH' };

    const { from = null, to = null, limit = null } = request.query;
    const info = escapeObject({ from, to }, db);

    try {
      const results = await db.query(`
        SELECT
          visitor_event.id, visitor_event.visitor_id,
          visitor_event.server_fired_at, visitor_event.user_fired_at,
          visitors.platform, visitors.browser, visitors.browser_version, visitors.os, visitors.os_version,
          visitor_event.display_width, visitor_event.display_height,
          error.message, error.url
        FROM visitor_event
        LEFT JOIN visitors ON visitors.id = visitor_event.visitor_id
        LEFT JOIN error ON error.id = visitor_event.event_id
        WHERE
          visitor_event.event_type = 'error'
          ${from ? `AND visitor_event.server_fired_at >= ${info.from}` : ''}
          ${to ? `AND visitor_event.server_fired_at <= ${info.to}` : ''}
        ORDER BY id DESC
        ${limit ? `LIMIT ${limit}` : ''}
      `);

      if (results.length === 0) return { body: [] };

      const resultsByDate = results
        .map(result => ({
          id: result.id,
          user_id: result.visitor_id,
          fired_at: {
            server: result.server_fired_at,
            client: result.user_fired_at,
          },
          platform: result.platform,
          browser: { name: result.browser, version: result.browser_version },
          os: { name: result.os, version: result.os_version },
          error: { message: result.message, url: result.url },
          display: { width: result.display_width, height: result.display_height },
        }))
        .sort((a, b) => b.id - a.id);

      return { body: resultsByDate };
    } catch (e) {
      throw Error(e);
    }
  },
};

module.exports = methods;