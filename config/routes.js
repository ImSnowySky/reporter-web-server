const methods = require('./methods');

const routes = {
  api: {
    v1: {
      init: [methods.get]
    },
  },
};

module.exports = routes;