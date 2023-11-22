import { Anime } from "src/anime/entities/anime.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FavoriteEpisode {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => UserEntity,{onDelete: 'CASCADE'})
    @JoinTable()
    user: UserEntity;

    @ManyToOne(() => Anime,{onDelete: 'CASCADE'})
    @JoinTable()
    anime: Anime;

    @Column()
    episode: number;
}
