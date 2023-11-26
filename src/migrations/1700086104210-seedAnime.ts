import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAnime1700086104210 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO anime (id, titulo, produtora, temporadas, episodios, nota, generoId, destaque, capa) VALUES
            (1, 'Naruto', 'Pierrot', 9, 220, 2, 1, 1, '2wCEAAoHCBUSERgSEhUYGBISERkUGBIYGBgSGBgYGBgaGRgYGBgcIS4lHB4sIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJSw2NDY1NDQ0NDY2NDQ0NDQ0NjQ0MTQ0NDQ0NDQ9MTQxNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP'),
            (2, 'Bleach', 'Pierrot', 16, 366, 4, 1, 1, 'https://uploads.metropoles.com/wp-content/uploads/2020/03/18113459/Bleach1.jpg'),
            (3, 'One Piece', 'Toei Animation', 21, 958, 4, 1, 1, 'https://epipoca.com.br/wp-content/uploads/2022/04/luffy-one-piece-1015.jpg'),
            (4, 'Dragon Ball Z', 'Toei Animation', 9, 291, 5, 1, 1, 'https://store-images.s-microsoft.com/image/apps.4856.63336639312113079.657749df-579b-470a-b3e2-92d0ba95f1ef.7ebbb338-8b45-4213-a30c-0db37fa974a5?q=90&w=480&h=270'),
            (5, 'Naruto Shippuden', 'Pierrot', 21, 500, 2, 1, 1, 'https://static.quizur.com/i/b/578a8605d07444.60203731manga-naruto.jpg');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM anime WHERE id BETWEEN 1 AND 5;
        `);
    }

}
