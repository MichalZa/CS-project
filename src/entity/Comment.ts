import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import Project from './Project';
import User from './User';

@Entity()
export default class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'text',
        name: 'content',
    })
    public content: string;

    @Column({
        type: 'timestamp',
        name: 'created_at',
    })
    public createdAt: Timestamp;

    @Column({
        type: 'timestamp',
        name: 'updated_at',
    })
    public updatedAt: Timestamp;

    @ManyToOne(type => User, user => user.comments)
    public user: User;

    @ManyToOne(type => Project, project => project.comments)
    public project: Project;
}
