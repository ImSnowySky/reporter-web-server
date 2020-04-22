const logger = require('./app/shared/logger');
const config = require('./config/server');
const createServer = require('./app/init/server');
const createDB = require('./app/init/db');

(async() => {
  const db = await createDB();
  const app = createServer(db);
  console.clear();
  app.listen(config.port, () => logger.SERVER_LISTENING_ON(config.port));
})()