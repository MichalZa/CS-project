import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import CommentRepository from '../repository/CommentRepository';
import CommentNewDto from '../dto/CommentNewDto';
import User from '../entity/User';
import ProjectRepository from '../repository/ProjectRepository';
import SecurityService from './SecurityService';
import CommentUpdateDto from '../dto/CommentUpdateDto';
import Comment from '../entity/Comment';
import Project from '../entity/Project';

@Service()
export default class CommentService {

    @InjectRepository()
    private readonly commentRepository: CommentRepository;
    @InjectRepository()
    private readonly projectRepository: ProjectRepository;
    @Inject()
    private readonly securityService: SecurityService;
    
    public async create(data: CommentNewDto, user: User) {
        const project: Project = await this.projectRepository.findOneOrFail(data.projectId);
        const comment: Comment = await this.commentRepository.save({
            content: data.text,
            project: project,
            user: user,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return { id: comment.id };
    }

    public read() {
        return this.commentRepository.getAllWithAuthors();
    }

    public async update(id: number, data: CommentUpdateDto, user: User) {
        const comment: Comment = await this.getById(id, user);

        return this.commentRepository.update(comment, {
            content: data.text,
            updatedAt: new Date()
        });
    }

    public async delete(id: number, user: User) {
        const comment: Comment = await this.getById(id, user);

        return await this.commentRepository.delete(comment);
    }

    private async getById(id: number, user: User) {
        const comment: Comment = await this.commentRepository.findOneOrFail(id, { relations: ['user'] });

        this.securityService.denyUnlessGranted(comment, user);

        return comment;
    }
}