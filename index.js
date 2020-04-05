const { createApp } = require('./app/init');


(async() => {
  const app = createApp();
  app.listen(3000, () => console.log('listening'));
})()