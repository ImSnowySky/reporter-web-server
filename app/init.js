const checkModelsAndControllers = (models, controllers) => {
  const modelsWithControllers = models.filter(
    model => !!controllers.find(
      controller => controller === model
    )
  );

  if (modelsWithControllers.length === models.length) {
    console.info('Every model have own controller');
    return true;
  }

  const modelsWithoutControllers = models.filter(
    model => !controllers.find(
      controller => controller === model
    )
  );

  console.warn('Not every model have own controller. Models without controllers: ');
  modelsWithoutControllers.forEach(model => console.log(`-- ${model} [app/models/${model}Model]`));
  return false;
};

const checkControllersMethods = (controllersMethods) => {
  const isSomeWithoutMethods = Object.keys(controllersMethods).find(controller => controllersMethods[controller] === false);
  if (!isSomeWithoutMethods) {
    console.info('Every controller have at least one method');
    return true;
  }

  console.warn('Some controllers have no at least one method. Controllers without any method: ');
  Object.keys(controllersMethods)
    .map(controller => ({
      name: controller,
      withMethods: (
        !!controllersMethods[controller].get ||
        !!controllersMethods[controller].post ||
        !!controllersMethods[controller].put ||
        !!controllersMethods[controller].delete
      )
    }))
    .filter(obj => !obj.withMethods)
    .forEach(obj => console.log(`-- ${obj.name} [app/controllers/${obj.name}Controller]`))

  return false;
}

module.exports = {
  checkModelsAndControllers,
  checkControllersMethods,
};