import * as bcrypt from 'bcrypt-nodejs';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import * as sinon from 'sinon';
import AppError from '../../src/common/error/type/AppError';
import AuthLoginDto from '../../src/dto/AuthLoginDto';
import AuthRegisterDto from '../../src/dto/AuthRegisterDto';
import User from '../../src/entity/User';
import TokenRepository from '../../src/repository/redis/TokenRepository';
import UserRepository from '../../src/repository/UserRepository';
import AuthService from '../../src/service/AuthService';
import JwtService from '../../src/service/JwtService';

describe('Auth Service test', () => {
    let authService: AuthService;
    let jwtService: JwtService;

    let userRepository: UserRepository;

    let authRegisterDto: AuthRegisterDto;
    let authLoginDto: AuthLoginDto;

    beforeEach(() => {
        userRepository = new UserRepository();

        jwtService = new JwtService(new TokenRepository(), userRepository);

        authRegisterDto = new AuthRegisterDto();
        authRegisterDto.email = 'email@email.com';

        authLoginDto = new AuthLoginDto();
        authLoginDto.email = 'login@email.com';
        authLoginDto.password = 'myPassword';
    });

    it('register fail - user already exists', () => {
        sinon.mock(userRepository).expects('exists').withArgs(authRegisterDto.email).returns(true);

        authService = new AuthService(userRepository, jwtService);

        expect(authService.register(authRegisterDto)).rejects.toEqual(new AppError('User already exists!'));
    });

    it('register success', async () => {
        const returnResult: object = {
            id: 1,
            email: authRegisterDto.email,
        };

        sinon.mock(userRepository).expects('exists').once().returns(false);
        sinon.mock(userRepository).expects('save').once().returns(returnResult);

        authService = new AuthService(userRepository, jwtService);

        const register = await authService.register(authRegisterDto);

        expect(register).toStrictEqual({returnResult});
    });

    it('login fail - user does not exist', () => {
        sinon.mock(userRepository).expects('findOneOrFail').withArgs({ email: authLoginDto.email }).rejects();

        const authService = new AuthService(userRepository, jwtService);

        expect(authService.login(authLoginDto)).rejects.toEqual(new NotFoundError('User does not exist'));
    });

    it('login fail - invalid credentials', () => {
        const user: User = new User();
        user.password = bcrypt.hashSync(authLoginDto.password);

        sinon.mock(userRepository).expects('findOneOrFail').once().resolves(user);

        const authService = new AuthService(userRepository, jwtService);

        authLoginDto.password = 'invalidPassword';

        expect(authService.login(authLoginDto)).rejects.toEqual(new UnauthorizedError('Incorrect password provided'));
    });

    it('login success', async () => {
        const user: User = new User();
        user.password = bcrypt.hashSync(authLoginDto.password);

        const token: string = 'token123';

        sinon.mock(userRepository).expects('findOneOrFail').once().resolves(user);
        sinon.mock(jwtService).expects('createToken').once().returns(token);

        const authService = new AuthService(userRepository, jwtService);
        const login = await authService.login(authLoginDto);

        expect(login).toStrictEqual({ token });
    });

    it('logout success', async () => {
        sinon.mock(jwtService).expects('verifyToken').once().returns(true);
        sinon.mock(jwtService).expects('flushToken').once().returns(true);

        const authService = new AuthService(userRepository, jwtService);

        const logout: object = await authService.logout('token');

        expect(logout).toStrictEqual({ success: true });
    });
});
