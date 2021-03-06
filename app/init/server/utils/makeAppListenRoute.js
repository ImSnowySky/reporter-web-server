const logger = require('../../../shared/logger');

const createRouteListener = (route, methodName, method, db) => async (req, res) => {
  const answer = { route, method: methodName };
  logger.REQUEST_STARTED(route);
  try {
    const {
      body = `No body returned from method ${methodName} on route ${route}`,
      status = 'OK',
      statusCode = 200,
    } = await method(req, db);

    answer.status = status;
    answer.response = body;
    res.status(statusCode).send(answer);
    status === 'OK'
      ? logger.REQUEST_SUCCESS(route)
      : logger.REQUEST_FAILED(route, body);

    return status === 'OK';
  } catch (e) {
    answer.status = 'Error';
    answer.response = e.message;
    res.status(500).send(answer);
    logger.REQUEST_FAILED(route, e);
    return false;
  }
}

const makeAppListenSingleRotue = (app, route, db) => {
  const pathToRouteModule = `${process.cwd()}\\app\\routes\\${route.path}\\index`;
  const exportedMethods = require(pathToRouteModule);
  route.methods.forEach(method => {
    if (!exportedMethods[method]) {
      logger.NO_METHOD_EXPORTED(method, pathToRouteModule);
      return null;
    }
    const webRoute = `/${route.path.replace(/\\/g, '/')}`;
    const webMethod = exportedMethods[method];    
    app[method](webRoute, createRouteListener(webRoute, method, webMethod, db));
  });
}

const makeAppListenRoutes = (app, routes, db) => {
  routes.forEach(route => makeAppListenSingleRotue(app, route, db));
}

module.exports = makeAppListenRoutes;