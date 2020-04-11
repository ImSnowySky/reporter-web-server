const crypto = require('crypto');

const methods = {
  get: async (request, db) => {
    console.log(request.query);
    return true;
  },
  //temporary for registration
  post: async(request, db) => {
    console.log(request);
    return true;
  },
};

module.exports = methods;