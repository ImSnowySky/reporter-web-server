const escapedObject = require('../../../../shared/escapeObject');

const reportAboutError = async (request, db) => {
  const {
    message,
    line_number,
    url,
  } = request.body;

  if (!message) throw Error('No message presented');
  if (!url) throw Error('No URL presented');

  const escapedInfo = escapedObject({ message, line_number, url }, db);

  try {
    const result = await db.query(`
      INSERT INTO error (message, line_number, url)
      VALUES (${escapedInfo.message}, ${escapedInfo.line_number}, ${escapedInfo.url})
    `);
    return result.insertId;
  } catch (e) {
    throw Error(e)
  }
};

const getUserIDByHash = async (hash, request, db) => {
  const escapedHash = db.connection.escape(hash);

  try {
    const result = await db.query(`
      SELECT id FROM visitors WHERE hash = ${escapedHash}
    `);

    return result.length > 0 ? result[0].id : null;
  } catch (e) {
    throw Error(e);
  }
}

const methods = {
  post: async(request, db) => {
    const {
      type,
      user_hash,
      user_time,
      display_width,
      display_height,
    } = request.body;

    const userID = await getUserIDByHash(user_hash, request, db);
    const server_time = new Date().toISOString();

    let id = null;

    switch (type) {
      case 'error':
        id = await reportAboutError(request, db);
        break;
      default:
        break;
    }

    const escapedInfo = escapedObject({
      visitor_id: userID,
      event_type: type,
      event_id: id,
      user_fired_at: user_time,
      server_fired_at: server_time,
      display_width,
      display_height,
    }, db);

    try {
      await db.query(`
        INSERT INTO visitor_event
          (
            visitor_id,
            event_type, event_id, user_fired_at, server_fired_at,
            display_width, display_height
          )
        VALUES
          (
            ${escapedInfo.visitor_id},
            ${escapedInfo.event_type}, ${escapedInfo.event_id}, ${escapedInfo.user_fired_at}, ${escapedInfo.server_fired_at},
            ${escapedInfo.display_width}, ${display_height}
          )
      `);
      return true;
    } catch (e) {
      throw Error(e);
    }
  },
};

module.exports = methods;