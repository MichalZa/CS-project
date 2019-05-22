import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export default class AuthLoginDto {

    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(5)
    @MaxLength(255)
    public password: string;
}