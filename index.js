const { getExpress, getRoutes } = require('./app/init');


(async() => {
  const app = getExpress();
  const routes = getRoutes();
  console.log(routes);
})()