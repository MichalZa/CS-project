import * as sinon from 'sinon';
import { DeleteResult, UpdateResult } from 'typeorm';
import ProjectDto from '../../src/dto/ProjectDto';
import Project, { status as ProjectStatus } from '../../src/entity/Project';
import User from '../../src/entity/User';
import CommentRepository from '../../src/repository/CommentRepository';
import ProjectRepository from '../../src/repository/ProjectRepository';
import ProjectService from '../../src/service/ProjectService';
import SecurityService from '../../src/service/SecurityService';

describe('Project Service test', () => {
    let projectService: ProjectService;
    let securityService: SecurityService;

    let commentRepository: CommentRepository;
    let projectRepository: ProjectRepository;

    let user: User;
    let project: Project;

    beforeEach(() => {
        commentRepository = new CommentRepository();
        projectRepository = new ProjectRepository();

        securityService = new SecurityService();

        user = new User();
        project = new Project();

        user.id = 1;
    });

    it('create sucess', async () => {
        project.id = 5;

        sinon.mock(projectRepository).expects('save').once().returns(project);

        projectService = new ProjectService(projectRepository, commentRepository, securityService);

        const create = await projectService.create(new ProjectDto(), user);

        expect(create).toStrictEqual({ id: project.id });
    });

    it('read with status success', async () => {
        const status = Object.keys(ProjectStatus)[0];
        const statusInt = ProjectStatus[status];

        project.status = statusInt;

        sinon.mock(projectRepository).expects('find').withArgs({ status: statusInt }).returns([project]);

        projectService = new ProjectService(projectRepository, commentRepository, securityService);

        const readWithStatus = await projectService.read(status);

        readWithStatus.forEach(project => {
            expect(project.status).toBe(statusInt);
        });
    });

    it('update success', async () => {
        project.user = user;

        sinon.mock(projectRepository).expects('findOneOrFail').once().resolves(project);
        sinon.mock(projectRepository).expects('update').once().resolves(UpdateResult);

        const projectService = new ProjectService(projectRepository, commentRepository, securityService);

        const update = await projectService.update(10, new ProjectDto(), user);

        expect(update).toBe(UpdateResult);
    });

    it('delete success', async () => {
        project.user = user;

        sinon.mock(projectRepository).expects('findOneOrFail').once().resolves(project);
        sinon.mock(projectRepository).expects('delete').once().resolves(DeleteResult);

        const projectService = new ProjectService(projectRepository, commentRepository, securityService);

        const projectDelete = await projectService.delete(10, user);

        expect(projectDelete).toBe(DeleteResult);
    });
});
