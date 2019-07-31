import {
    Body,
    HeaderParam,
    JsonController,
    Post,
 } from 'routing-controllers';
import { Inject } from 'typedi';
import AuthLoginDto from './../dto/AuthLoginDto';
import AuthRegisterDto from './../dto/AuthRegisterDto';
import AuthService from './../service/AuthService';

@JsonController('/auth')
export default class AuthContoller {

    @Inject()
    private readonly authService: AuthService;

    @Post('/registration')
    public register(@Body() data: AuthRegisterDto) {
        return this.authService.register(data);
    }

    @Post('/login')
    public login(@Body() data: AuthLoginDto) {
        return this.authService.login(data);
    }

    @Post('/logout')
    public logout(@HeaderParam('Authorization', { required: true }) token: string) {
        return this.authService.logout(token);
    }
}
