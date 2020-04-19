const methods = require('./methods');

const routes = {
  api: {
    v1: {
      init: [methods.get],
      auth: [methods.get, methods.post],
      error: [methods.post],
      get_visitor_id: [methods.get],
    },
  },
};

module.exports = routes;