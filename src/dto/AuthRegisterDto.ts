import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export default class AuthRegisterDto {
    @IsString()
    @MinLength(5, { message: 'Name is too short. Minimal value is $constraintl' })
    @MaxLength(255, { message: 'Name is too long. Maxiumum length is $constraintl' })
    public name: string;

    @IsEmail()
    @MaxLength(255, { message: 'Email is too long. Maxiumum length is $constraintl' })
    public email: string;

    @IsString()
    @MinLength(5, { message: 'Password is too short. Minimal value is $constraintl' })
    @MaxLength(255, { message: 'Password is too long. Maximum value is $constraintl' })
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password is too weak' },
    )
    public password: string;
}
