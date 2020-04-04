import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as helmet from 'helmet';
import 'reflect-metadata';
import { useContainer as routeUseContainer, useExpressServer, Action } from 'routing-controllers';
import { Container as diContainer } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import { initS3 } from '../common/aws/s3';
import ErrorHandler from './../common/error/ErrorHandler';
import { loadConfig } from './config';
import database from './database';
import logger from './logger';
import redis from './redis';

export default async (): Promise<express.Application> => {

    ormUseContainer(diContainer);

    loadConfig();

    logger();

    initS3();

    const errorHandler: ErrorHandler = diContainer.get(ErrorHandler);

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

    app.get('/_readiness', (req, res) => {
        // ToDo:
        // is this container ready for incoming connections?
        // sample query to db
        if (true) {
            res.send(200).send({status: 'ready'});
        } else {
            res.send(500).send({status: 'unready'});
        }
    });

    app.get('/_liveness', (req, res) => {
        // "does this container work or does it need to be replaced?"
        // check your app internals for health, but maybe
        // don't check for db connection, that's what readiness is for
        // this validates express is responding to requests
        // and not deadlocked
        // - If Kubelet fails this test, it kills and recreates pod
        res.status(200).send({status: 'live'});
      });

    routeUseContainer(diContainer);

    return useExpressServer(app, {
        routePrefix: '/api',
        controllers: [`${__dirname}/../controller/*.{js,ts}`],
        middlewares: [`${__dirname}/../middleware/*.{js,ts}`],
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
