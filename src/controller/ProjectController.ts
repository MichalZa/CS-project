import {
    JsonController,
    Post,
    Get,
    Put,
    Delete,
    HttpCode,
    Param,
    Body,
    UseBefore,
    CurrentUser,
    Authorized,
    QueryParam
 } from 'routing-controllers';
import { Inject } from 'typedi';
import ProjectService from './../service/ProjectService';
import AuthMiddleware from './../middleware/AuthMiddleware';
import User from '../entity/User';
import ProjectDto from '../dto/ProjectDto';
import CommentService from '../service/CommentService';

@UseBefore(AuthMiddleware)
@JsonController('/project')
export default class ProjectController {

    @Inject()
    private readonly projectService: ProjectService;
    @Inject()
    private readonly commentService: CommentService;
    
    @Authorized('ROLE_OWNER')
    @HttpCode(201)
    @Post('/')
    public create(@Body() data: ProjectDto, @CurrentUser() user: User) {
        return this.projectService.create(data, user);
    }

    @Post('/:id/comment')
    public createComment(@Param('id') id: number, @Body() data: ProjectDto, @CurrentUser() user: User) {
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