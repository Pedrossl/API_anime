import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAnime1700086104210 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO anime (id, titulo, produtora, temporadas, episodios, nota, generoId, destaque, capa) VALUES
            (1, 'Naruto', 'Pierrot', 9, 220, 8.5, 1, 1, 'https://i.imgur.com/2j6x5u1.jpg'),
            (2, 'Bleach', 'Pierrot', 16, 366, 8.5, 1, 1, 'https://i.imgur.com/2j6x5u1.jpg'),
            (3, 'One Piece', 'Toei Animation', 21, 958, 8.5, 1, 1, 'https://i.imgur.com/2j6x5u1.jpg'),
            (4, 'Dragon Ball Z', 'Toei Animation', 9, 291, 8.5, 1, 1, 'https://i.imgur.com/2j6x5u1.jpg'),
            (5, 'Naruto Shippuden', 'Pierrot', 21, 500, 8.5, 1, 1, 'https://i.imgur.com/2j6x5u1.jpg');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM anime WHERE id BETWEEN 1 AND 5;
        `);
    }

}
