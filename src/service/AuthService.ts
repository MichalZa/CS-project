import * as bcrypt from 'bcrypt-nodejs';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import AppError from './../common/error/type/AppError';
import AuthLoginDto from './../dto/AuthLoginDto';
import AuthRegisterDto from './../dto/AuthRegisterDto';
import User from './../entity/User';
import UserRepository from './../repository/UserRepository';
import JwtService from './JwtService';

@Service()
export default class AuthService {

    constructor(@InjectRepository() private readonly userRepository: UserRepository,
                private readonly jwtService: JwtService) {}

    public async register(data: AuthRegisterDto): Promise<{ id: number, email: string  }> {
        const userExists: boolean = await this.userRepository.exists(data.email);
        if (userExists) {
            throw new AppError('User already exists!');
        }

        const user: User = await this.userRepository.save({
            name: data.name,
            email: data.email,
            password: bcrypt.hashSync(data.password),
            role: ['ROLE_USER'],
            createdAt: new Date(),
        });

        return {
            id: user.id,
            email: user.email,
        };
    }

    public async login(data: AuthLoginDto): Promise<{ token: string }> {
        const user: User = await this.userRepository.findOneOrFail({ email: data.email }).catch((error: any) => {
            throw new NotFoundError('User does not exist');
        });

        const isCorrectPassword: boolean = bcrypt.compareSync(data.password, user.password);
        if (!isCorrectPassword) {
            throw new UnauthorizedError('Incorrect password provided');
        }

        const token: string = await this.jwtService.createToken(user);

        return { token };
    }

    public async logout(token: string): Promise<{ success: boolean }> {
        const validTokenData = await this.jwtService.verifyToken(token);
        const success: boolean = await this.jwtService.flushToken(validTokenData.user, token);

        return { success };
    }
}
