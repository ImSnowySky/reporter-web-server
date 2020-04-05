const express = require('express');
const formRoutesFromConfig = require('./utils/formRoutesFromConfig');
const routes = require('../../config/routes');
let app = null;

const getExpress = () => {
  if (!app) app = express();
  return app;
}

const getRoutes = () => formRoutesFromConfig(routes);

module.exports = {
  getExpress,
  getRoutes,
};