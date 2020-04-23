const methods = require('./methods');

const routes = {
  api: {
    v1: {
      init: [methods.get],
      auth: [methods.get, methods.post],
      report: [methods.post],
      visitor_id: [methods.post],
      visitor_hash_exists: [methods.get],
    },
  },
};

module.exports = routes;