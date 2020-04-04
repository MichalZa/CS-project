import * as config from 'nconf';

export const loadConfig = (): void => {
    const env: string = process.env.NODE_ENV || 'dev';
    const file: string = `${process.cwd()}/config/${env}.json`;

    config.file(env, { file });
};
