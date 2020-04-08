import * as http from 'http';

import { Application } from 'express';
import application from './app/app';

const run = async (): Promise<void> => {
    const port: number = +process.env.PORT || 3000;
    const app: Application = await application();
    const server: http.Server = app.listen(port);
    // register handlers for graceful shutdown
    registerShutdownHandlers(server);

    console.info(`Server has started on port ${port}`);
};

const registerShutdownHandlers = (server: http.Server): void => {
    process.on('SIGINT', () => {
        console.info('Got SIGINT (ctrl-c in docker). Shutdown ', new Date().toISOString());
        shutdown(server);
    });
    process.on('SIGTERM', () => {
        console.info('Got SIGINT (docker container stop). Shutdown ', new Date().toISOString());
        shutdown(server);
    });
};

const shutdown = (server: http.Server): void => {
    server.close((err: Error) => {
        if (err) {
            console.error(err);
            process.exitCode = 1;
        }
        process.exit();
    });
};

run();
