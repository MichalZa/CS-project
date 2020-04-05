import * as _ from 'lodash';
import * as md5 from 'md5';
import * as nconf from 'nconf';
import { RedisClient } from 'redis';
import { Inject, Service } from 'typedi';

import User from './../../entity/User';

@Service()
export default class TokenRepository {
    @Inject('redis')
    private readonly redisClient: RedisClient;

    public addByUser(user: User, token: string): Promise<boolean> {
        const userKey = this.getUserKey(user, true);
        const tokenTTL = nconf.get('redis').tokenTTL;

        return new Promise((resolve, reject) => {
            this.redisClient.setex(userKey, tokenTTL, token, (error, response) => {
                error ? reject(error) : resolve(!!response);
            });
        });
    }

    public async exists(user: User, token: string): Promise<boolean> {
        const userTokens = await this.getAllByUser(user);

        return _.values(userTokens).includes(token);
    }

    public getAllKeysByUser(user: User): Promise<string[]> {
        const userKey = this.getUserKey(user);
        const pattern = userKey + ':*';

        return new Promise((resolve, reject) => {
            this.redisClient.keys(pattern, (error, list) => {
                error ? reject(error) : resolve(list);
            });
        });
    }

    public async getAllByUser(user: User): Promise<string[]> {
        const userTokens: any = {};
        const userKeys = await this.getAllKeysByUser(user);
        for (const key of userKeys) {
            const token = await this.getByKey(key);

            userTokens[key] = token;
        }

        return userTokens;
    }

    public getByKey(key: string): Promise<string> {
        return new Promise((resolve , reject) => {
            this.redisClient.get(key, (error, result) => {
                error ? reject(error) : resolve(result);
            });
        });
    }

    public deleteByKey(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.redisClient.del(key, (error, result) => {
                error ? reject(error) : resolve(!!result);
            });
        });
    }

    private getUserKey(user: User, withTimestamp = false): string {
        let userHash = md5(user.email + user.id);

        if (withTimestamp) {
            userHash += ':' + Date.now();
        }

        return userHash;
    }
}
