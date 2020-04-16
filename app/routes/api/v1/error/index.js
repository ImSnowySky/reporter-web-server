const methods = {
  get: async () => true,
  post: async(request, db) => {
    const {
      type,
      message,
      line_number,
      url,
      platform,
      os,
      os_version,
      browser,
      browser_version,
      user_agent,
      display_width,
      display_height,
      user_time,
    } = request.query;

    if (!message) throw Error('No message presented');
    if (!url) throw Error('No URL presented');
    if (!platform) throw Error('No platform presented');
    if (!os) throw Error('No OS presented');
    if (!browser) throw Error('No browser');
    if (!userAgent) throw Error('No UA presented');

    const escapedInfo = {
      type: db.connection.escape(type),
      message: db.connection.escape(message),
      line_number: db.connection.escape(line_number),
      url: db.connection.escape(url),
      platform: db.connection.escape(platform),
      os: db.connection.escape(os),
      os_version: db.connection.escape(os_version),
      browser: db.connection.escape(browser),
      browser_version: db.connection.escape(browser_version),
      display_width: Number(display_width),
      display_height: Number(display_height),
      user_agent: db.connection.escape(user_agent),
      user_time: db.connection.escape(user_time),
      server_time: new Date().toUTCString(),
    };

    console.log(escapedInfo);

    try {
      await db.query(`
        INSERT INTO errors
          (
            type, message, line_number, url, 
            platform, os, os_version, browser, browser_version,
            display_width, display_height, user_agent,
            user_time, server_time
          ) 
        VALUES 
          (
            ${escapedInfo.type}, ${escapedInfo.message}, ${escapedInfo.line_number}, ${escapedInfo.url},
            ${escapedInfo.platform}, ${escapedInfo.os}, ${escapedInfo.os_version}, ${escapedInfo.browser}, ${escapedInfo.browser_version},
            ${escapedInfo.display_width}, ${escapedInfo.display_height}, ${escapedInfo.user_agent},
            ${escapedInfo.user_time}, ${escapedInfo.server_time}
          )
      `);
      return true;
    } catch (e) {
      throw Error(`Request have error: ${e}`);
    }

  },
};

module.exports = methods;