import * as sinon from 'sinon';
import CommentDto from '../../src/dto/CommentDto';
import User from '../../src/entity/User';
import CommentRepository from '../../src/repository/CommentRepository';
import ProjectRepository from '../../src/repository/ProjectRepository';
import CommentService from '../../src/service/CommentService';
import SecurityService from '../../src/service/SecurityService';

describe('CommentService test', () => {
    let commentService: CommentService;
    let securityService: SecurityService;

    let commentRepository: CommentRepository;
    let projectRepository: ProjectRepository;

    const invalidProjectId: number = 5;
    const validProjectId: number = 10;

    const invalidCommentId: number = 6;
    const validCommentId: number = 12;

    beforeEach(() => {
        commentRepository = new CommentRepository();
        projectRepository = new ProjectRepository();
        securityService = new SecurityService();
    });

    it('create fail - invalid project id', () => {
        sinon.mock(projectRepository).expects('findOneOrFail').withArgs(invalidProjectId).throws();

        commentService =  new CommentService(
            commentRepository,
            projectRepository,
            securityService,
        );

        expect(commentService.create(invalidProjectId, new CommentDto(), new User())).rejects.toThrow();
    });

    it('create success - valid project id', async () => {
        sinon.mock(projectRepository).expects('findOneOrFail').withArgs(validProjectId).returns({ id: validProjectId });
        sinon.mock(commentRepository).expects('save').once().returns({ id: 5 });

        commentService =  new CommentService(
            commentRepository,
            projectRepository,
            securityService,
        );

        const create = await commentService.create(validProjectId, new CommentDto(), new User());

        expect(create).toStrictEqual({ id: 5 });
    });

    it('read all', () => {
        sinon.mock(commentRepository).expects('getAllWithAuthors').returns({});

        commentService =  new CommentService(
            commentRepository,
            projectRepository,
            securityService,
        );

        const read = commentService.read();

        expect(read).toStrictEqual({});
    });
});
