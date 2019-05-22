import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { useExpressServer, useContainer as routeUseContainer, Action } from 'routing-controllers';
import { Container as diContainer } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import database from './database'
import redis from './redis';
import config from './config';
import ErrorHandler from './../common/error/ErrorHandler';
import logger from './logger';
import * as helmet  from 'helmet';
import AuthController from './../controller/AuthController';
import ProjectController from './../controller/ProjectController';
import CommentController from './../controller/CommentController';

export default async (): Promise<express.Application> => {

    ormUseContainer(diContainer)

    config();

    logger();

    const errorHandler = diContainer.get(ErrorHandler);

    process.on('unhandledRejection', (error: any) => {
        throw error;
    })
    process.on('uncaughtException', (error: any) => {
        errorHandler.handle(error);
    });

    await Promise.all([database(), redis()]).catch((e) => {
        console.log(e);
        errorHandler.handle(e, false);
    });

    const app = express();

    // use XSS etc filters
    app.use(helmet());
    
    app.use(bodyParser.json());
    
    routeUseContainer(diContainer);
    
    return useExpressServer(app, {
        routePrefix: '/api',
        controllers: [AuthController, ProjectController, CommentController],
        middlewares: [__dirname + '/../middleware/*.js'],
        currentUserChecker: async (action: Action) => {
            return action.request.currentUser;
        },
        authorizationChecker: async (action: Action, roles: string[]) => {
            const user = action.request.currentUser;
            if (user && !roles.length)
                return true;
            if (user && roles.find(role => user.role.indexOf(role) !== -1))
                return true;
     
            return false;
        }
    });
}