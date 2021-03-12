import logger from 'log4js';

const log = logger.getLogger();
log.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

export default log;
