import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export default class AuthLoginDto {
    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(5)
    @MaxLength(255)
    public password: string;
}
