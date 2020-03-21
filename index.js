const { getModels } = require('./app/models');
const { getControllers, getControllersMethods } = require('./app/controllers');
const { checkModelsAndControllers, checkControllersMethods } = require('./app/init');

(async() => {
  const [models, controllers, controllersMethods] = await Promise.all([
    getModels(),
    getControllers(),
    getControllersMethods(),
  ]);

  const isModelsAndControllersCorrect = checkModelsAndControllers(models, controllers);
  if (!isModelsAndControllersCorrect) throw new Error('Models and controllers are not same');
  const isEveryControllerWithMethods = checkControllersMethods(controllersMethods);
  if (!isEveryControllerWithMethods) throw new Error('Not every controller have at least one method');
})()