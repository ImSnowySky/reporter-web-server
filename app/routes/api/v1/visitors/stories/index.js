const escapeObject = require('../../../../../shared/escapeObject');
const getAuthToken = require('../../../../../shared/getAuthToken');
const isTokenCorrect = require('../../user/token_correct')['get']; 

const methods = {
  get: async (request, db) => {
    const token = getAuthToken(request);
    if (!token) return { status: 'Error', body: 'NO_AUTH' }

    const tokenCorrect = await isTokenCorrect(request, db).then(res => !!res.body);
    if (!tokenCorrect) return { status: 'Error', body: 'NO_AUTH' };

    const { limit = null } = request.query;

    try {
      const results = await db.query(`
        SELECT
          visitors_hash.hash,
          visitor_event.event_type, visitor_event.server_fired_at,
          breadcrumb.url AS breadcrumb_url, breadcrumb.message AS breadcrumb_message,
          error.url AS error_url, error.message AS error_message
        FROM (
          SELECT visitors.id, visitors.hash FROM visitors
          ORDER BY visitors.id DESC
          ${limit ? `LIMIT ${limit}` : ''}
        ) AS visitors_hash
        LEFT JOIN visitor_event ON visitor_event.visitor_id = visitors_hash.id
        LEFT JOIN breadcrumb ON visitor_event.event_type = 'breadcrumb' AND breadcrumb.id = visitor_event.event_id
        LEFT JOIN error ON visitor_event.event_type = 'error' AND error.id = visitor_event.event_id
      `);

      if (results.length === 0) return { body: { } };

      const resultsAsObject = { };
      results
        .map(story => ({
          user: story.hash,
          type: story.event_type,
          info: {
            url: story.event_type === 'breadcrumb' ? story.breadcrumb_url : story.error_url,
            message: story.event_type === 'breadcrumb' ? story.breadcrumb_message : story.error_message,
          },
          fired_at: story.server_fired_at,
        }))
        .forEach(story => {
          if (!resultsAsObject[story.user]) resultsAsObject[story.user] = [];
          resultsAsObject[story.user].push({
            type: story.type,
            info: story.info,
            fired_at: story.fired_at,
          });
        });

      return { body: resultsAsObject };
    } catch (e) {
      throw Error(e);
    }
  },
};

module.exports = methods;