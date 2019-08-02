import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import * as sinon from 'sinon';
import User from '../../src/entity/User';
import TokenRepository from '../../src/repository/redis/TokenRepository';
import UserRepository from '../../src/repository/UserRepository';
import JwtService from '../../src/service/JwtService';
import config from './../../src/app/config';

describe('Jwt Service test', () => {
    let tokenRepository: TokenRepository;
    let userRepository: UserRepository;

    let jwtService: JwtService;

    let user: User;

    beforeEach(() => {
        tokenRepository = new TokenRepository();
        userRepository = new UserRepository();

        user = new User();
        user.id = 10;
        user.email = 'email@email.com';

        // load config cause we need signature
        config();
    });

    it('create token success', async () => {
        const token = 'abc123';

        sinon.mock(user).expects('generateAuthToken').once().returns(token);
        sinon.mock(tokenRepository).expects('addByUser').once().returns(true);

        jwtService = new JwtService(tokenRepository, userRepository);

        const createToken = await jwtService.createToken(user);

        expect(createToken).toEqual(token);
    });

    it('flush token fail - invalid token', () => {
        const userTokens = ['token123'];
        const token = 'myToken111';

        sinon.mock(tokenRepository).expects('getAllByUser').once().returns(userTokens);

        jwtService = new JwtService(tokenRepository, userRepository);

        expect(jwtService.flushToken(user, token)).rejects.toEqual(new NotFoundError());
    });

    it('flush token success', async () => {
        const userTokens = ['token123'];
        const token = userTokens[0];

        sinon.mock(tokenRepository).expects('getAllByUser').once().returns(userTokens);
        sinon.mock(tokenRepository).expects('deleteByKey').once().returns(true);

        jwtService = new JwtService(tokenRepository, userRepository);

        const flushToken = await jwtService.flushToken(user, token);

        expect(flushToken).toBe(true);
    });

    it ('verify token fail - invalid signature', () => {
        const token = 'token';

        jwtService = new JwtService(tokenRepository, userRepository);

        expect(jwtService.verifyToken(token)).rejects.toEqual(new UnauthorizedError('Invalid token'));
    });

    it ('verify token fail - user does not exist', () => {
        const token = user.generateAuthToken();

        sinon.mock(userRepository).expects('findOneOrFail').once().rejects();

        jwtService = new JwtService(tokenRepository, userRepository);

        expect(jwtService.verifyToken(token)).rejects.toEqual(new NotFoundError('User does not exist'));
    });

    it ('verify token fail - token does not exist in redis', () => {
        const token = user.generateAuthToken();

        sinon.mock(userRepository).expects('findOneOrFail').once().resolves(user);
        sinon.mock(tokenRepository).expects('exists').once().returns(false);

        jwtService = new JwtService(tokenRepository, userRepository);

        expect(jwtService.verifyToken(token)).rejects.toEqual(new UnauthorizedError('Invalid token'));
    });

    it ('verify token success', async () => {
        const token = user.generateAuthToken();

        sinon.mock(userRepository).expects('findOneOrFail').once().resolves(user);
        sinon.mock(tokenRepository).expects('exists').once().returns(true);

        jwtService = new JwtService(tokenRepository, userRepository);

        const verifyToken = await jwtService.verifyToken(token);

        expect(verifyToken).toStrictEqual({ user, token });
    });
});
