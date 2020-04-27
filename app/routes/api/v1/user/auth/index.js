const crypto = require('crypto');
const escapeObject = require('../../../../../shared/escapeObject');

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
      const result = await db.query(`SELECT id, password_hash FROM users WHERE password_hash=${info.hash} LIMIT 1`);
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 1);
      const authToken = crypto.createHmac('sha256', expDate.toISOString()).update(result[0].password_hash).digest('hex');
      const escapedUpdateInfo = escapeObject({ id: result[0].id, date: expDate.toISOString(), token: authToken }, db);
      await db.query(`UPDATE users SET access_token=${escapedUpdateInfo.token}, token_active_for=${escapedUpdateInfo.date} WHERE id=${escapedUpdateInfo.id}`);
      return { body: authToken };
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
      return { body: info.hash }
    } catch (e) {
      const errCode = e.message.split(': ')[0];
      switch (errCode) {
        case ('ER_DUP_ENTRY'):
          return { status: 'Error', body: 'Login is busy' };
        default:
          throw Error(e);
      }
    }
  },
};

module.exports = methods;