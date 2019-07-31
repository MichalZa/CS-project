import * as sinon from 'sinon';
import CommentDto from '../../src/dto/CommentDto';
import User from '../../src/entity/User';
import CommentRepository from '../../src/repository/CommentRepository';
import ProjectRepository from '../../src/repository/ProjectRepository';
import CommentService from '../../src/service/CommentService';
import SecurityService from '../../src/service/SecurityService';

describe('CommentService test', () => {
    let commentService: CommentService;

    const invalidProjectId: number = 5;
    const validProjectId: number = 10;

    beforeEach(() => {

        const commentRepository = new CommentRepository();
        const commentRepositoryMock = sinon.mock(commentRepository);

        const projectRepository = new ProjectRepository();
        const projectRepositoryMock = sinon.mock(projectRepository);

        commentRepositoryMock.expects('getAllWithAuthors').once().returns({});
        commentRepositoryMock.expects('save').once().returns({ id: 5 });

        projectRepositoryMock.expects('findOneOrFail').withArgs(invalidProjectId).throws();
        projectRepositoryMock.expects('findOneOrFail').withArgs(validProjectId).returns({ id: validProjectId });

        commentService =  new CommentService(
            commentRepository,
            projectRepository,
            new SecurityService(),
        );
    });

    it('create fail - invalid project id', () => {
        expect(commentService.create(invalidProjectId, new CommentDto(), new User())).rejects.toThrow();
    });

    it('create success - valid project id', async () => {
        const create = await commentService.create(validProjectId, new CommentDto(), new User());

        expect(create).toStrictEqual({ id: 5 });
    });

    it('read all', () => {
        const read = commentService.read();

        expect(read).toStrictEqual({});
    });
});
