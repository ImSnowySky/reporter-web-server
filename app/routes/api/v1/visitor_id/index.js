const crypto = require('crypto');
const escapeObject = require('../../../../shared/escapeObject');

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

    const currentTime = new Date().toISOString();
    const salt = String(Math.random());
    const userUniqueString = currentTime + salt;

    const hash = crypto
      .createHmac('sha256', salt)
      .update(userUniqueString)
      .digest('hex');

    const escapedData = escapeObject({ hash, platform, os, os_version, browser, browser_version, user_agent }, db);
  
    try {
      await db.query(`
        INSERT INTO visitors
          (hash, platform, os, os_version, browser, browser_version, user_agent)
        VALUES
          (${escapedData.hash}, ${escapedData.platform}, ${escapedData.os}, ${escapedData.os_version}, ${escapedData.browser}, ${escapedData.browser_version}, ${escapedData.user_agent})
      `);
      return { body: hash };
    } catch(e) {
      throw Error(e);
    }
  },
};

module.exports = methods;