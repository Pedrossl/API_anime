import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedGenero1700085518845 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO genero (id, nome) VALUES
            (1, 'Ação'),
            (2, 'Aventura'),
            (3, 'Comédia'),
            (4, 'Drama'),
            (5, 'Fantasia'),
            (6, 'Ficção científica'),
            (7, 'Musical'),
            (8, 'Romance'),
            (9, 'Suspense'),
            (10, 'Terror');
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM genero WHERE id BETWEEN 1 AND 10;
        `)
    }

}
