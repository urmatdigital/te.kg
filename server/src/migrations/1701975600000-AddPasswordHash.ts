import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordHash1701975600000 implements MigrationInterface {
    name = 'AddPasswordHash1701975600000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "password_hash" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "password_hash"`
        );
    }
}
