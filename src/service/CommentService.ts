import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import CommentRepository from '../repository/CommentRepository';
import CommentDto from '../dto/CommentDto';
import User from '../entity/User';
import ProjectRepository from '../repository/ProjectRepository';
import SecurityService from './SecurityService';
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
    
    public async create(id: number, data: CommentDto, user: User) {
        const project: Project = await this.projectRepository.findOneOrFail(id);
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

    public async update(id: number, data: CommentDto, user: User) {
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