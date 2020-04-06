const createRouteListener = (route, methodName, method) => (_, res) => {
  const answer = { route, method: methodName };
  try {
    const result = method();
    answer.status = 'OK';
    answer.response = result;
    res.send(answer);
    return true;
  } catch (e) {
    answer.status = 'Error';
    answer.response = e.message;
    res.send(answer);
    return false;
  }
}

const makeAppListenSingleRotue = (app, route) => {
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
    
    app[method](webRoute, createRouteListener(webRoute, method, webMethod));
  });
}

const makeAppListenRoutes = (app, routes) => {
  routes.forEach(route => makeAppListenSingleRotue(app, route));
}

module.exports = makeAppListenRoutes;