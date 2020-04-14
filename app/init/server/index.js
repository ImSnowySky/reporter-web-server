const express = require('express');
const formRoutesFromConfig = require('./utils/formRoutesFromConfig');
const makeAppListenRoutes = require('./utils/makeAppListenRoute');
const routes = require('../../../config/routes');
const cors = require('cors');
const bodyParser = require('body-parser');
let app = null;

const getExpress = () => {
  if (!app) {
    app = express();
    app.use(bodyParser.json());
    app.use(cors());
  }
  return app;
}

const getRoutes = () => formRoutesFromConfig(routes);

const createServer = (db, app = getExpress(), routes = getRoutes()) => {
  makeAppListenRoutes(app, routes, db);
  return app;
}

module.exports = createServer;