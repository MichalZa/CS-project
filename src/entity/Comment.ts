import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Timestamp } from 'typeorm';
import Project from './Project';
import User from './User';

@Entity()
export default class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        name: 'content'
    })
    content: string;

    @Column({
        type: 'timestamp',
        name: 'created_at'
    })
    createdAt: Timestamp;

    @Column({
        type: 'timestamp',
        name: 'updated_at',
    })
    updatedAt: Timestamp;

    @ManyToOne(type => User, user => user.comments)
    user: User;

    @ManyToOne(type => Project, project => project.comments)
    project: Project;
}