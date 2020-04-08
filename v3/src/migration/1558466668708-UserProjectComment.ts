import {MigrationInterface, QueryRunner} from 'typeorm';

export class UserProjectComment1558466668708 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `project` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `description` text NOT NULL, `status` int NOT NULL, `created_at` timestamp NOT NULL, `updated_at` timestamp NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `comment` (`id` int NOT NULL AUTO_INCREMENT, `content` text NOT NULL, `created_at` timestamp NOT NULL, `updated_at` timestamp NOT NULL, `userId` int NULL, `projectId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `project` ADD CONSTRAINT `FK_7c4b0d3b77eaf26f8b4da879e63` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `comment` ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `comment` ADD CONSTRAINT `FK_61e5bdd38addac8d6219ca102ee` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `comment` DROP FOREIGN KEY `FK_61e5bdd38addac8d6219ca102ee`');
        await queryRunner.query('ALTER TABLE `comment` DROP FOREIGN KEY `FK_c0354a9a009d3bb45a08655ce3b`');
        await queryRunner.query('ALTER TABLE `project` DROP FOREIGN KEY `FK_7c4b0d3b77eaf26f8b4da879e63`');
        await queryRunner.query('DROP TABLE `comment`');
        await queryRunner.query('DROP TABLE `project`');
        await queryRunner.query('DROP TABLE `user`');
    }

}
