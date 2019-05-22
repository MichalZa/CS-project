import { IsString, MinLength, IsInt } from 'class-validator';

export default class CommentNewDto {

    @IsString()
    @MinLength(5, {
        message: 'Comment is too short. Minimal value is $constraintl'
    })
    public text: string;

    @IsInt()
    public projectId: number;
}