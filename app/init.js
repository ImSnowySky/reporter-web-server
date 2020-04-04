const express = require('express');
let app = null;

const getMethodURL = (controller, method) => `/${controller.toLowerCase()}/${method.toLowerCase()}`;

const getResponseOrError = (controller, method, methodFn = () => { throw new Error('Method is not init') }) => {
  const baseObject = { controller: controller.toLowerCase(), method: method.toLowerCase() }
  try {
    return {...baseObject, status: 'OK', result: methodFn() }
  } catch (e) {
    return { ...baseObject, status: 'Error', result: e.message }
  }
}

const createGetListeners = (controller, methods, app = createOrGetApplication()) => {
  methods.forEach(method => {
    const methodFn = require(`./controllers/${controller}Controller/index`).get[method];
    app.get(getMethodURL(controller, method), (_, res) => res.send(
      getResponseOrError(controller, method, methodFn)
    ))
  });
}

const createPostListeners = (controller, methods, app = createOrGetApplication()) => {
  methods.forEach(method => {
    const methodFn = require(`./controllers/${controller}Controller/index`).post[method];
    app.post(getMethodURL(controller, method), (_, res) => res.send(
      getResponseOrError(controller, method, methodFn)
    ))
  });
}

const createOrGetApplication = () => {
  if (!app) app = express();
  return app;
}

const initControllerRequest = (app, controller, methods) => {
  Object.keys(methods).forEach(methodType => {
    if (!methods[methodType]) return;  
    switch (methodType) {
      case 'get':
        createGetListeners(controller, methods[methodType])
        break;
      case 'post':
        createPostListeners(controller, methods[methodType])
        break;
      case 'put':
        break;
      case 'delete':
        break;
      default:
        break;
    }
  })
}

module.exports = {
  createOrGetApplication,
  initControllerRequest,
};