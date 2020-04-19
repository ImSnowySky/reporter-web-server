const crypto = require('crypto');

const methods = {
  get: async () => {
    const currentTime = new Date().toISOString();
    const salt = String(Math.random());
    const userUniqueString = currentTime + salt;

    const hash = crypto
      .createHmac('sha256', salt)
      .update(userUniqueString)
      .digest('hex');

    return hash;
  },
};

module.exports = methods;