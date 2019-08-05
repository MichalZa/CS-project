import * as sinon from 'sinon';
import { DeleteResult, UpdateResult } from 'typeorm';
import CommentDto from '../../src/dto/CommentDto';
import Comment from '../../src/entity/Comment';
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

    let user: User;
    let comment: Comment;

    const invalidProjectId: number = 5;
    const validProjectId: number = 10;
    const validCommentId: number = 12;

    beforeEach(() => {
        commentRepository = new CommentRepository();
        projectRepository = new ProjectRepository();

        securityService = new SecurityService();

        user = new User();
        comment = new Comment();

        user.id = 5;
    });

    it('create fail - invalid project id', () => {
        sinon.mock(projectRepository).expects('findOneOrFail').withArgs(invalidProjectId).throws();

        commentService =  new CommentService(
            commentRepository,
            projectRepository,
            securityService,
        );

        expect(commentService.create(invalidProjectId, new CommentDto(), user)).rejects.toThrow();
    });

    it('create success - valid project id', async () => {
        sinon.mock(projectRepository).expects('findOneOrFail').withArgs(validProjectId).returns({ id: validProjectId });
        sinon.mock(commentRepository).expects('save').once().returns({ id: 5 });

        commentService =  new CommentService(
            commentRepository,
            projectRepository,
            securityService,
        );

        const create = await commentService.create(validProjectId, new CommentDto(), user);

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

    it('update success', async () => {
        comment.user = user;

        sinon.mock(commentRepository).expects('findOneOrFail').once().resolves(comment);
        sinon.mock(commentRepository).expects('update').once().resolves(UpdateResult);

        const commentService = new CommentService(commentRepository, projectRepository, securityService);

        const update = await commentService.update(validCommentId, new CommentDto(), user);

        expect(update).toBe(UpdateResult);
    });

    it('delete success', async () => {
        comment.user = user;

        sinon.mock(commentRepository).expects('findOneOrFail').once().resolves(comment);
        sinon.mock(commentRepository).expects('delete').once().resolves(DeleteResult);

        const commentService = new CommentService(commentRepository, projectRepository, securityService);

        const commentDelete = await commentService.delete(validCommentId, user);

        expect(commentDelete).toBe(DeleteResult);
    });
});
