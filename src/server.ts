import * as http from 'http';

import application from './app/app';

const run = async () => {
    const port = process.env.PORT || 3000;
    const app = await application();
    const server: http.Server = app.listen(port);
    // register handlers for graceful shutdown
    registerShutdownHandlers(server);

    console.info(`Server has started on port ${port}`);
};

const registerShutdownHandlers = (server: http.Server) => {
    process.on('SIGINT', () => {
        console.info('Got SIGINT (ctrl-c in docker). Shutdown ', new Date().toISOString());
        shutdown(server);
    });
    process.on('SIGTERM', () => {
        console.info('Got SIGINT (docker container stop). Shutdown ', new Date().toISOString());
        shutdown(server);
    });
};

const shutdown = (server: http.Server) => {
    server.close(err => {
        if (err) {
            console.error(err);
            process.exitCode = 1;
        }
        process.exit();
    });
};

run();
