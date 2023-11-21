import { Anime } from "src/anime/entities/anime.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FavoriteEpisode {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinTable()
    user: UserEntity;

    @ManyToOne(() => Anime)
    @JoinTable()
    anime: Anime;

    @Column()
    episode: number;
}
