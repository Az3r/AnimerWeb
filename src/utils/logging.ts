import log from 'log4js';

const logger = log.getLogger();
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

export default logger;
