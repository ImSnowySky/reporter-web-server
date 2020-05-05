const methods = require('./methods');

const routes = {
  api: {
    v1: {
      init: [methods.get],
      visitors: {
        create: [methods.post],
        hash_exists: [methods.get],
        info: {
          short: [methods.get],
        }
      },
      user: {
        auth: [methods.get, methods.post],
        token_correct: [methods.get],
      },
      reports: {
        create: [methods.post],
        errors: [methods.get],
      },
    },
  },
};

module.exports = routes;