const colors = require('colors');
const serverConfig = require('../../config/server');
const { log: levelsOfLogging } = serverConfig;

const logFNWithLevels = {
  SERVER_LISTENING_ON: {
    level: 'SYSTEM',
    fn: port => console.log(
      colors.green('Server listening on port'),
      colors.yellow(port)
    ),
  },
  MYSQL_QUERY: {
    level: 'QUERY',
    fn: query => console.log(
      colors.magenta('MYSQL QUERY:'),
      colors.gray(query),
    ),
  },
  REQUEST_STARTED: {
    level: 'REQUEST',
    fn: route => console.log(
      colors.cyan('Request on:'),
      colors.yellow(route),
    ),
  },
  REQUEST_SUCCESS: {
    level: 'REQUEST',
    fn: route => console.log(
      colors.cyan('Request on'),
      colors.yellow(route),
      colors.cyan('finished'),
      colors.green('successfull')
    ),
  },
  REQUEST_FAILED: {
    level: 'REQUEST',
    fn: (route, error) => {
      console.log(
        colors.cyan('Request on'),
        colors.yellow(route),
        colors.red('failed'),
      );
      console.log(
        colors.red(error.toString())
      );
    },
  },
  NO_METHOD_EXPORTED: {
    level: 'SYSTEM',
    fn: (method, path) => console.log(
      colors.red('No method'),
      colors.yellow(method),
      colors.red('in'),
      colors.yellow(path)
    ),
  },
};

const logger = { };

Object.keys(logFNWithLevels).forEach(key => {
  const logFunction = logFNWithLevels[key];
  logger[key] = levelsOfLogging.includes(logFunction.level)
    ? logFunction.fn
    : () => { }
});

module.exports = logger;