import { IsString, MinLength } from 'class-validator';

export default class CommentUpdateDto {

    @IsString()
    @MinLength(5, {
        message: 'Comment is too short. Minimal value is $constraintl'
    })
    public text: string;
}