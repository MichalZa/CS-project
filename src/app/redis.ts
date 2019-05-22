import { get } from 'nconf'
import { RedisClient, createClient } from 'redis';
import { Container } from 'typedi';

export default () => {
    const config = get('redis')
    const redisClient: RedisClient = createClient({
        host: config.host,
        port: config.port,
        //password: config.password
    });
    
    Container.set('redis', redisClient);
}