import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    HttpCode,
    JsonController,
    Param,
    Post,
    Put,
    QueryParam,
    UseBefore,
 } from 'routing-controllers';
import { Inject } from 'typedi';
import CommentDto from '../dto/CommentDto';
import ProjectDto from '../dto/ProjectDto';
import User from '../entity/User';
import CommentService from '../service/CommentService';
import AuthMiddleware from './../middleware/AuthMiddleware';
import ProjectService from './../service/ProjectService';

@UseBefore(AuthMiddleware)
@JsonController('/project')
export default class ProjectController {
    constructor(
        private projectService: ProjectService,
        private commentService: CommentService,
    ) {}

    @Authorized('ROLE_OWNER')
    @HttpCode(201)
    @Post('/')
    public create(@Body() data: ProjectDto, @CurrentUser() user: User) {
        return this.projectService.create(data, user);
    }

    @HttpCode(201)
    @Post('/:id/comment')
    public createComment(@Param('id') id: number, @Body() data: CommentDto, @CurrentUser() user: User) {
        return this.commentService.create(id, data, user);
    }

    @Authorized('ROLE_OWNER')
    @Put('/:id')
    public update(@Param('id') id: number, @Body() data: ProjectDto, @CurrentUser() user: User) {
        return this.projectService.update(id, data, user);
    }

    @Get('/')
    public read(@QueryParam('status') status: string) {
        return this.projectService.read(status);
    }

    @Get('/:id/comment')
    public readComments(@Param('id') id: number) {
        return this.projectService.readComments(id);
    }

    @Authorized('ROLE_OWNER')
    @Delete('/:id')
    public delete(@Param('id') id: number, @CurrentUser() user: User) {
        return this.projectService.delete(id, user);
    }
}
