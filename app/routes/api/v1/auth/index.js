const crypto = require('crypto');

const getEscapedUserInfo = (login, password, connection) => {
  const escaped = {
    login: connection.escape(login),
    password: connection.escape(password),
  };

  const hash = crypto
    .createHmac('sha256', escaped.login)
    .update(escaped.password)
    .digest('hex');

  escaped.hash = connection.escape(hash);

  return escaped;
}

const methods = {
  get: async (request, db) => {
    const { login, password } = request.query;
    if (!login || !password) throw Error ('No login or password presented');
    const info = getEscapedUserInfo(login, password, db.connection);
    
    try {
      const result = await db.query(`SELECT password_hash FROM users WHERE password_hash=${info.hash} LIMIT 1`);
      return result[0].password_hash;
    } catch(e) {
      throw Error(e);
    }
  },
  post: async(request, db) => {
    const { body } = request.body;
    if (!body || !body.login || !body.password) throw Error('No login or password presented');
    const info = getEscapedUserInfo(body.login, body.password, db.connection);

    try {
      await db.query(`INSERT INTO users (name, password_hash) VALUES (${info.login}, ${info.hash})`);
      return info.hash;
    } catch (e) {
      throw Error(e);
    }
  },
};

module.exports = methods;