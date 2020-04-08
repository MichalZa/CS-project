import {MigrationInterface, QueryRunner} from 'typeorm';

export class Roles1558478709281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `user` ADD `role` text NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `user` DROP COLUMN `role`');
    }

}
