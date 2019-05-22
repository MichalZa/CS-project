import { Service, Inject } from 'typedi';
import User from '../entity/User';
import ProjectRepository from '../repository/ProjectRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';;
import SecurityService from './SecurityService';
import ProjectDto from '../dto/ProjectDto';
import Project, { status as ProjectStatus } from './../entity/Project';
import CommentRepository from '../repository/CommentRepository';
import { filterXSS } from 'xss';

@Service()
export default class ProjectService {

    @InjectRepository()
    private readonly projectRepository: ProjectRepository;
    @InjectRepository()
    private readonly commentRepository: CommentRepository;
    @Inject()
    private readonly securityService: SecurityService;

    public async create(data: ProjectDto, user: User) {
        const project: Project = await this.projectRepository.save({
            title: data.title,
            description: filterXSS(data.description),
            status: data.status,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: user
        });

        return { id: project.id };
    }

    public async read(status: string) {
        if (status in ProjectStatus) {
            return this.projectRepository.find({ status: ProjectStatus[status] });
        }

        return this.projectRepository.find();
    }

    public async readComments(id: number) {
        const project: Project = await this.projectRepository.findOneOrFail(id);

        return this.commentRepository.find({ project })
    }

    public async update(id: number, data: ProjectDto, user: User) {
        const project: Project = await this.getById(id, user);

        return this.projectRepository.update(project, {
            title: filterXSS(data.title),
            description: data.description,
            status: data.status,
            updatedAt: new Date()
        });
    }

    public async delete(id: number, user: User) {
        const project: Project = await this.getById(id, user);

        return await this.projectRepository.delete(project);
    }

    private async getById(id: number, user: User) {
        const project: Project = await this.projectRepository.findOneOrFail(id, { relations: ['user'] });

        this.securityService.denyUnlessGranted(project, user);

        return project;
    }
}