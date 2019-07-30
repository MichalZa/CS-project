import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as helmet from 'helmet';
import 'reflect-metadata';
import { useContainer as routeUseContainer, useExpressServer, Action } from 'routing-controllers';
import { Container as diContainer } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import ErrorHandler from './../common/error/ErrorHandler';
import config from './config';
import database from './database';
import logger from './logger';
import redis from './redis';

export default async (): Promise<express.Application> => {

    ormUseContainer(diContainer);

    config();

    logger();

    const errorHandler = diContainer.get(ErrorHandler);

    process.on('unhandledRejection', (error: any) => {
        throw error;
    });
    process.on('uncaughtException', (error: any) => {
        errorHandler.handle(error);
    });

    await Promise.all([database(), redis()]).catch(e => {
        errorHandler.handle(e, false);
    });

    const app = express();

    // use XSS etc filters
    app.use(helmet());
    app.use(bodyParser.json());

    routeUseContainer(diContainer);

    return useExpressServer(app, {
        routePrefix: '/api',
        controllers: [__dirname + '/../controller/*.js'],
        middlewares: [__dirname + '/../middleware/*.js'],
        currentUserChecker: async (action: Action) => {
            return action.request.currentUser;
        },
        authorizationChecker: async (action: Action, roles: string[]) => {
            const user = action.request.currentUser;
            if (user && !roles.length) {
                return true;
            }
            if (user && roles.find(role => user.role.indexOf(role) !== -1)) {
                return true;
            }

            return false;
        },
    });
};
