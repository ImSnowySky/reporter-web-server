const ALLOW_REQUEST_FROM = require('../../../../config/allow');
const CORS_ALLOWED_DOMAINS = [...ALLOW_REQUEST_FROM.FRONTEND, ...ALLOW_REQUEST_FROM.CLIENT];

const allowCORS = (req, res, next) => {
  const { origin } = req.headers;

  if (CORS_ALLOWED_DOMAINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  }

  next();
};

module.exports = allowCORS;