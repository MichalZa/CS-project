import { Service } from 'typedi';
import { DeleteResult, UpdateResult } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { filterXSS } from 'xss';

import ProjectDto from '../dto/ProjectDto';
import Comment from '../entity/Comment';
import User from '../entity/User';
import CommentRepository from '../repository/CommentRepository';
import ProjectRepository from '../repository/ProjectRepository';
import Project, { status as ProjectStatus } from './../entity/Project';
import SecurityService from './SecurityService';

@Service()
export default class ProjectService {
    constructor(
        @InjectRepository() private projectRepository: ProjectRepository,
        @InjectRepository() private commentRepository: CommentRepository,
        private securityService: SecurityService,
    ) {}

    public async create(data: ProjectDto, user: User): Promise<{ id: number }> {
        const project: Project = await this.projectRepository.save({
            title: data.title,
            description: filterXSS(data.description),
            status: data.status,
            createdAt: new Date(),
            updatedAt: new Date(),
            user,
        });

        return { id: project.id };
    }

    public async read(status: string): Promise<Project[]> {
        if (status in ProjectStatus) {
            return this.projectRepository.find({ status: ProjectStatus[status] });
        }

        return this.projectRepository.find();
    }

    public async readComments(id: number): Promise<Comment[]> {
        const project: Project = await this.projectRepository.findOneOrFail(id);

        return this.commentRepository.find({ project });
    }

    public async update(id: number, data: ProjectDto, user: User): Promise<UpdateResult> {
        const project: Project = await this.getById(id, user);

        return this.projectRepository.update(project, {
            title: filterXSS(data.title),
            description: data.description,
            status: data.status,
            updatedAt: new Date(),
        });
    }

    public async delete(id: number, user: User): Promise<DeleteResult> {
        const project: Project = await this.getById(id, user);

        return await this.projectRepository.delete(project);
    }

    private async getById(id: number, user: User): Promise<Project> {
        const project: Project = await this.projectRepository.findOneOrFail(id, { relations: ['user'] });

        this.securityService.denyUnlessGranted(project, user);

        return project;
    }
}
