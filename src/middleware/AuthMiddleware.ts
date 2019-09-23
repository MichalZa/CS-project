import { BadRequestError, ExpressMiddlewareInterface, UnauthorizedError} from 'routing-controllers';
import { Inject } from 'typedi';
import JwtService from './../service/JwtService';

export default class AuthMiddleware implements ExpressMiddlewareInterface {

    @Inject()
    private readonly jwtService: JwtService;

    public async use(request: any, response: any, next: any) {
        const requestToken: string = request.headers.authorization;
        if (!requestToken) {
            throw new BadRequestError('Required headers not provided');
        }

        const tokenVerifiedData: any = await this.jwtService.verifyToken(requestToken);

        request.currentUser = tokenVerifiedData.user;

        next();
    }
}
