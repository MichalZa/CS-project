import * as nconf from 'nconf';
import { Container } from 'typedi';
import * as winston from 'winston';
import { Logger } from 'winston';

export default () => {
    const config = nconf.get('winston');

    const logger: Logger = winston.createLogger({
        transports: [
          // in the docker we want only logging to stdout
          new winston.transports.Console(),
        ],
        level: config.level,
      });

    Container.set('logger', logger);
};
