const methods = require('./methods');

const routes = {
  api: {
    v1: {
      profile: {
        init: [methods.get]
      },
      init2: [methods.get],
    },
    v2: {
      init3: [methods.get]
    },
  },
  private: {
    v3: {
      init4: [methods.get],
      init5: [methods.get],
    },
    v4: {
      init6: [methods.get],
      init7: [methods.get],
    },
  }
};

module.exports = routes;