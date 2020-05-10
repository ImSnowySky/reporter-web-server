const crypto = require('crypto');
const userIP = require('user-ip');
const escapeObject = require('../../../../../shared/escapeObject');

const methods = {
  post: async (request, db) => {
    const {
      platform,
      os,
      os_version,
      browser,
      browser_version,
      user_agent,
    } = request.body;

    let ip = userIP(request);
    ip = ip === '::1' || ip === '::ffff:127.0.0.1' ? '127.0.0.1' : ip;

    console.log(userIP(request));

    const currentTime = new Date().toISOString();
    const salt = String(Math.random());
    const userUniqueString = currentTime + salt;

    const hash = crypto
      .createHmac('sha256', salt)
      .update(userUniqueString)
      .digest('hex');

    const escapedData = escapeObject({ hash, ip, platform, os, os_version, browser, browser_version, user_agent, session_start: currentTime }, db);
  
    try {
      await db.query(`
        INSERT INTO visitors
          (hash, ip, platform, os, os_version, browser, browser_version, user_agent, session_start)
        VALUES
          (
            ${escapedData.hash}, ${escapedData.ip}, ${escapedData.platform}, ${escapedData.os}, ${escapedData.os_version},
            ${escapedData.browser}, ${escapedData.browser_version}, ${escapedData.user_agent}, ${escapedData.session_start}
          )
      `);
      return { body: hash };
    } catch(e) {
      throw Error(e);
    }
  },
};

module.exports = methods;