const crypto = require('crypto');
const escapeObject = require('../../../../../shared/escapeObject');

const generateAuthToken = passwordHash => {
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + 1);
  return { expires: expDate.toISOString(), token: crypto.createHmac('sha256', expDate.toISOString()).update(passwordHash).digest('hex') };
}

const getPasswordHash = (login, password) => crypto
  .createHmac('sha256', login)
  .update(password)
  .digest('hex');

const methods = {
  get: async (request, db) => {
    const { login, password } = request.query;
    if (!login || !password) throw Error ('No login or password presented');
    const hash = getPasswordHash(login, password);
    const info = escapeObject({ hash }, db);
    
    try {
      const result = await db.query(`SELECT id, password_hash FROM users WHERE password_hash=${info.hash} LIMIT 1`);
      if (result.length === 0) {
        return { body: 'Wrong login or password', status: 'Error' }
      }
  
      const { expires, token } = generateAuthToken(result[0].password_hash);
      const escapedUpdateInfo = escapeObject({ id: result[0].id, date: expires, token }, db);
      await db.query(`UPDATE users SET access_token=${escapedUpdateInfo.token}, token_active_for=${escapedUpdateInfo.date} WHERE id=${escapedUpdateInfo.id}`);
      return { body: token };
    } catch(e) {
      throw Error(e);
    }
  },
  post: async(request, db) => {
    const { body } = request.body;
    if (!body || !body.login || !body.password) throw Error('No login or password presented');
    const hash = getPasswordHash(body.login, body.password);
    const { expires, token } = generateAuthToken(hash);

    const info = escapeObject({ login: body.login, password: body.password, hash, date: expires, token }, db);

    try {
      await db.query(`INSERT INTO users (name, password_hash, access_token, token_active_for) VALUES (${info.login}, ${info.hash}, ${info.token}, ${info.date})`);
      return { body: token }
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