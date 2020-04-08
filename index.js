const createServer = require('./app/init/server');
const createDB = require('./app/init/db');


(async() => {
  const db = await createDB();
  const app = createServer(db);
  app.listen(3000, () => console.log('listening'));
})()