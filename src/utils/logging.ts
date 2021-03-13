import logger from 'log4js';

logger.configure({
  appenders: {
    firebase: {
      type: 'file',
      filename: 'logs/firebase.log',
      maxLogSize: 1000000000,
    },
    all: {
      type: 'file',
      filename: 'logs/all.log',
      maxLogSize: 1000,
      backups: 3,
      compress: true,
    },
    development: {
      type: 'stdout',
    },
    api: {
      type: 'file',
      filename: 'logs/api.log',
      maxLogSize: 1000,
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ['development'],
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
    api: {
      appenders: ['api'],
      level: 'info',
    },
  },
});

const log = logger.getLogger();
export default log;
export const apiLog = logger.getLogger('api');
