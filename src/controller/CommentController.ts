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
import CommentNewDto from '../dto/CommentNewDto';
import User from '../entity/User';
import CommentUpdateDto from '../dto/CommentUpdateDto';

@UseBefore(AuthMiddleware)
@JsonController('/comment')
export default class CommentController {

    @Inject()
    private readonly commentService: CommentService;
    
    @HttpCode(201)
    @Post('/')
    public create(@Body() data: CommentNewDto, @CurrentUser() user: User) {
        return this.commentService.create(data, user);
    }

    @Put('/:id')
    public update(@Param('id') id: number, @Body() data: CommentUpdateDto, @CurrentUser() user: User) {
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