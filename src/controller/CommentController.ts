import {
    JsonController,
    Post,
    Get,
    Put,
    Delete,
    HttpCode,
    Param,
    UseBefore,
    Body,
    CurrentUser
 } from 'routing-controllers';
import { Inject } from 'typedi';
import CommentService from './../service/CommentService';
import AuthMiddleware from './../middleware/AuthMiddleware';
import User from '../entity/User';
import CommentDto from '../dto/CommentDto';

@UseBefore(AuthMiddleware)
@JsonController('/comment')
export default class CommentController {

    @Inject()
    private readonly commentService: CommentService;

    @Put('/:id')
    public update(@Param('id') id: number, @Body() data: CommentDto, @CurrentUser() user: User) {
        return this.commentService.update(id, data, user);
    }

    @Get('/')
    public read() {
        return this.commentService.read();
    }

    @Delete('/:id')
    public delete(@Param('id') id: number, @CurrentUser() user: User) {
        return this.commentService.delete(id, user);
    }
}