import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Timestamp, OneToMany } from 'typeorm';
import User from './User'
import Comment from './Comment';

@Entity()
export default class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        name: 'title',
        length: 255
    })
    title: string;

    @Column({
        type: 'text',
        name: 'description',
    })
    description: string;

    @Column({
        type: 'integer',
        name: 'status'
    })
    status: number;

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

    @ManyToOne(type => User, user => user.projects)
    user: User;

    @OneToMany(type => Comment, comment => comment.project)
    comments: Comment[];

}

export const status = {
    unpublished: 0,
    published: 1
};