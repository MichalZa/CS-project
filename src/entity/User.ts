import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as conf from 'nconf';
import Comment from './Comment';
import Project from './Project';

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        name: 'name',
        length: 255
    })
    name: string;

    @Column({
        type: 'varchar',
        name: 'email',
        length: 255
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    password: string;

    @Column({
        type: 'simple-array'
    })
    role: string[];

    @OneToMany(type => Project, project => project.user)
    projects: Project[];

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[];

    public generateAuthToken() {
        const config = conf.get('jwt');
        const token = jwt.sign({
            _id: this.id,
            email: this.email,
        }, config.signature, { expiresIn: config.expiresIn })

        return token;
    }
}