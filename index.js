const { getModels } = require('./app/models');
const { getControllers, getControllersMethods } = require('./app/controllers');
const { checkModelsAndControllers, checkControllersMethods } = require('./app/checks');
const {  createOrGetApplication, initControllerRequest } = require('./app/init');


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

  const app = createOrGetApplication();
  controllers.forEach(controller => {
    const methods = controllersMethods[controller];
    initControllerRequest(app, controller, methods);
  })

  app.listen(3000, () => {
    console.log('Listening');
  })
})()