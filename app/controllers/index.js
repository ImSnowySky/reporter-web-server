const Filehound = require('filehound');

const getControlllersPath = async () => await Filehound.create()
  .path('app/controllers')
  .directory()
  .find();

const getControllers = async () => {
  const controllersPath = await getControlllersPath();
  return controllersPath.map(path => path.replace('app\\controllers\\', '').replace('Controller', ''))
}

const getControllersMethods = async () => {
  const controllersPath = await getControllers();
  const controllerMethods = { };
  controllersPath.forEach(controller => {
    const methods = require(`./${controller}Controller`);
    if (!methods.get && !methods.post && !methods.put && !methods.delete) {
      controllerMethods[controller] = false;
    } else {
      controllerMethods[controller] = {
        get: methods.get ? Object.keys(methods.get) : undefined,
        post: methods.post ? Object.keys(methods.post) : undefined,
        put: methods.put ? Object.keys(methods.put) : undefined,
        delete: methods.delete ? Object.keys(methods.delete) : undefined,
      };
    }
  });

  return controllerMethods;
}

module.exports = { getControllers, getControllersMethods };
