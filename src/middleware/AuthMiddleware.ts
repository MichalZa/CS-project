import { BadRequestError, ExpressMiddlewareInterface } from 'routing-controllers';

import User from '../entity/User';
import JwtService from './../service/JwtService';

export default class AuthMiddleware implements ExpressMiddlewareInterface {
    constructor(private jwtService: JwtService) {}

    public async use(request: any, response: any, next: any): Promise<void> {
        const requestToken: string = request.headers.authorization;
        if (!requestToken) {
            throw new BadRequestError('Required headers not provided');
        }

        const tokenVerifiedData: { user: User, token: string } = await this.jwtService.verifyToken(requestToken);

        request.currentUser = tokenVerifiedData.user;

        next();
    }
}
