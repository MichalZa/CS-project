import { get } from 'nconf';
import { createClient, RedisClient } from 'redis';
import { Container } from 'typedi';

export default () => {
    const config = get('redis');
    const redisClient: RedisClient = createClient({
        host: config.host,
        port: config.port,
    });

    Container.set('redis', redisClient);
};
