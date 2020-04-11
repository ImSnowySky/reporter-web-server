const crypto = require('crypto');

const methods = {
  get: async (request, db) => {
    console.log(request.query);
    return true;
  },
  //temporary for registration
  post: async(request, db) => {
    const { body } = request.body;

    if (!body || !body.login || !body.password) {
      throw Error('No login or password presented');
    }

    const hash = crypto
      .createHmac('sha256', body.login)
      .update(body.password)
      .digest('hex');

    return hash;
  },
};

module.exports = methods;