const getAuthToken = require('../../../../../shared/getAuthToken');
const isTokenCorrect = require('../../user/token_correct')['get']; 

const methods = {
  get: async (request, db) => {
    const token = getAuthToken(request);
    if (!token) return { status: 'Error', body: 'NO_AUTH' }

    const tokenCorrect = await isTokenCorrect(request, db).then(res => !!res.body);
    if (!tokenCorrect) return { status: 'Error', body: 'NO_AUTH' };

    const { from = null, to = null, limit = null } = request.query;

    try {
      const results = await db.query(`
        SELECT 
          visitor_event.id, visitor_event.server_fired_at,
          visitors.platform, visitors.browser, visitors.browser_version, visitors.os, visitors.os_version,
          error.message, error.url	
        FROM visitor_event
        LEFT JOIN visitors ON visitors.id = visitor_event.visitor_id
        LEFT JOIN error ON error.id = visitor_event.event_id
        WHERE visitor_event.event_type = 'error' 
        ORDER BY id
        ${limit && !Number.isNaN(parseInt(limit)) ? `LIMIT ${limit}` : ''}
      `);

      if (results.length === 0) return { body: [] };

      const dateRange = {
        from: from ? +new Date(from) : null,
        to: to ? +new Date(to) : null,
      };

      const resultsByDate = results
        .filter(result =>
          dateRange.from
            ? +new Date(result.server_fired_at) >= dateRange.from
            : true
        )
        .filter(result =>
          dateRange.to
            ? +new Date(result.server_fired_at) <= dateRange.to
            : true  
        )
        .map(result => ({
          id: result.id,
          server_fired_at: result.server_fired_at,
          platform: result.platform,
          browser: {
            name: result.browser,
            version: result.browser_version,
          },
          os: {
            name: result.os,
            version: result.os_version,
          },
          error: {
            message: result.message,
            url: result.url,
          },
        }))
        .sort((a, b) => b.id - a.id);

      return { body: resultsByDate };
    } catch (e) {
      throw Error(e);
    }
  },
};

module.exports = methods;