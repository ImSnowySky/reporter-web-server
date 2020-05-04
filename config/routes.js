const methods = require('./methods');

const routes = {
  api: {
    v1: {
      init: [methods.get],
      visitor: {
        id: [methods.post],
        hash_exists: [methods.get],
      },
      user: {
        auth: [methods.get, methods.post],
        token_correct: [methods.get],
      },
      errors: [methods.get],
      report: [methods.post],
    },
  },
};

module.exports = routes;