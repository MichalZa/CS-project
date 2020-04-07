import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as conf from 'nconf';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import User from './../entity/User';
import TokenRepository from './../repository/redis/TokenRepository';
import UserRepository from './../repository/UserRepository';

@Service()
export default class JwtService {
    constructor(
        private tokenRepository: TokenRepository,
        @InjectRepository() private userRepository: UserRepository,
    ) {}

    public async createToken(user: User): Promise<string> {
        const token: string = user.generateAuthToken();

        await this.tokenRepository.addByUser(user, token);

        return token;
    }

    public async flushToken(user: User, token: string): Promise<boolean> {
        const userTokens = await this.tokenRepository.getAllByUser(user);
        const tokenKey: string | undefined = _.findKey(userTokens, value => value === token);

        if (tokenKey === undefined) {
            throw new NotFoundError();
        }

        return await this.tokenRepository.deleteByKey(tokenKey);
    }

    public checkIfExists(user: User, token: string): Promise<boolean> {
        return this.tokenRepository.exists(user, token);
    }

    public async verifyToken(token: string): Promise<{ user: User, token: string }> {
        let verifiedToken: any;
        try {
            verifiedToken = jwt.verify(token, conf.get('jwt').signature);
        } catch (error) {
            throw new UnauthorizedError('Invalid token');
        }

        const user: User = await this.userRepository.findOneOrFail({ email: verifiedToken.email }).catch(() => {
            throw new NotFoundError('User does not exist');
        });
        const exists: boolean = await this.checkIfExists(user, token);

        if (!exists) {
            throw new UnauthorizedError('Invalid token');
        }

        return { user, token };
    }
}
