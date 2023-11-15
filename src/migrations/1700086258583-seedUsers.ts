import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class SeedUsers1700086258583 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const saltRounds = 15;
    
        const hashedPasswordAdmin = bcrypt.hashSync('Thor!1234', saltRounds);
        const hashedPasswordNewUser = bcrypt.hashSync('Lobato!1234', saltRounds);
        const hashedPasswordCommonUser = bcrypt.hashSync('Erva!1234', saltRounds);
    
        await queryRunner.query(`
          INSERT INTO user_entity (name, email, password, role, code)
          VALUES
          ('Thor', 'Thor@animecom.com', '${hashedPasswordAdmin}', 'admin', null),
          ('Lobato', 'Lobato@animecom.com', '${hashedPasswordNewUser}', 'newUser', null),
          ('Isa', 'Isa@ervadementa.com', '${hashedPasswordCommonUser}', 'commonUser', null)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          DELETE FROM user_entity WHERE id IN (1, 2, 3)
        `);
    }
}
