import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import Comment from './Comment';
import User from './User';

@Entity()
export default class Project {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'varchar',
        name: 'title',
        length: 255,
    })
    public title: string;

    @Column({
        type: 'text',
        name: 'description',
    })
    public description: string;

    @Column({
        type: 'integer',
        name: 'status',
    })
    public status: number;

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

    @ManyToOne(type => User, user => user.projects)
    public user: User;

    @OneToMany(type => Comment, comment => comment.project)
    public comments: Comment[];

}

export const status = {
    unpublished: 0,
    published: 1,
};
