const escapedObject = require('../../../../shared/escapeObject');

const methods = {
  post: async(request, db) => {
    const {
      type,
      message,
      line_number,
      url,
      display_width,
      display_height,
      user_time,
    } = request.body;

    if (!message) throw Error('No message presented');
    if (!url) throw Error('No URL presented');

    const escapedInfo = escapedObject(
      { type, message, line_number, url, display_width, display_height, user_time, server_time: new Date().toISOString() },
      db
    );

    try {
      const result = await db.query(`
        INSERT INTO errors
          (
            type, message, line_number, url, 
            display_width, display_height,
            user_time, server_time
          ) 
        VALUES
          (
            ${escapedInfo.type}, ${escapedInfo.message}, ${escapedInfo.line_number}, ${escapedInfo.url},
            ${escapedInfo.display_width}, ${escapedInfo.display_height},
            ${escapedInfo.user_time}, ${escapedInfo.server_time}
          )
      `);

      const insertedID = result.insertId;
      return insertedID;
    } catch (e) {
      throw Error(`Request have error: ${e}`);
    }

  },
};

module.exports = methods;