const createRouteListener = (route, methodName, method, db) => async (req, res) => {
  const answer = { route, method: methodName };
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  try {
    const result = await method(req, db);
    answer.status = 'OK';
    answer.response = result;
    res.status(200).send(answer);
    return true;
  } catch (e) {
    answer.status = 'Error';
    answer.response = e.message;
    res.status(500).send(answer);
    return false;
  }
}

const makeAppListenSingleRotue = (app, route, db) => {
  const pathToRouteModule = `${process.cwd()}\\app\\routes\\${route.path}\\index`;
  const exportedMethods = require(pathToRouteModule);
  route.methods.forEach(method => {
    if (!exportedMethods[method]) {
      console.error(`No method ${method} in ${pathToRouteModule}`);
    }
    const webRoute = `/${route.path.replace(/\\/g, '/')}`;
    const webMethod = exportedMethods[method]
      ? exportedMethods[method]
      : () => { throw new Error(`No method ${method} in ${route.path.replace(/\\/g, '/')}`) };
    
    app[method](webRoute, createRouteListener(webRoute, method, webMethod, db));
  });
}

const makeAppListenRoutes = (app, routes, db) => {
  routes.forEach(route => makeAppListenSingleRotue(app, route, db));
}

module.exports = makeAppListenRoutes;