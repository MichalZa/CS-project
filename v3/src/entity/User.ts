import * as jwt from 'jsonwebtoken';
import * as conf from 'nconf';
import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import Comment from './Comment';
import Project from './Project';

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'varchar',
        length: 255,
    })
    public name: string;

    @Index({ unique: true })
    @Column({
        type: 'varchar',
        length: 255,
    })
    public email: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    public password: string;

    @Column({ type: 'simple-array' })
    public role: string[];

    @OneToMany(type => Project, project => project.user)
    public projects: Project[];

    @OneToMany(type => Comment, comment => comment.user)
    public comments: Comment[];

    public generateAuthToken(): string {
        const config = conf.get('jwt');

        return jwt.sign({
            _id: this.id,
            email: this.email,
        }, config.signature, { expiresIn: config.expiresIn });
    }
}
