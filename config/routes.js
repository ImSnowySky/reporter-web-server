const methods = require('./methods');

const routes = {
  api: {
    v1: {
      init: [methods.get],
      auth: [methods.get, methods.post],
      error: [methods.post],
      visitor_id: [methods.post],
    },
  },
};

module.exports = routes;