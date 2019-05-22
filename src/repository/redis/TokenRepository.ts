import User from './../../entity/User';
import { RedisClient } from 'redis';
import { Inject } from 'typedi';
import * as md5 from 'md5';
import * as nconf from 'nconf';
import * as _ from 'lodash'

export default class TokenRepository {

    @Inject('redis')
    private readonly redisClient: RedisClient;

    public addByUser(user: User, token: string): Promise<boolean> {
        const userKey = this.getUserKey(user, true);
        const tokenTTL = nconf.get('redis').tokenTTL;

        return new Promise((resolve, reject) => {
            this.redisClient.setex(userKey, tokenTTL, token, (error, response) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(!!response)
                }
            });
        })
    }

    public async exists(user: User, token: string): Promise<boolean> {
        const userTokens = await this.getAllByUser(user);

        return _.values(userTokens).includes(token);
    }

    public getAllKeysByUser(user: User): Promise<string[]> {
        const userKey = this.getUserKey(user);
        const pattern = userKey + ":*";

        return new Promise((resolve, reject) => {
            this.redisClient.keys(pattern, (error, list) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(list);
                }
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
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    public deleteByKey(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.redisClient.del(key, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(!!result);
                }
            });
        });
    }

    private getUserKey(user: User, withTimestamp = false) {
        let userHash = md5(user.email + user.id);
        
        if (withTimestamp) {
            userHash += ':' + Date.now();
        }

        return userHash;
    }
}