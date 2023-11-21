import { FavoriteEpisode } from 'src/favorite-episode/entities/favorite-episode.entity';
import { Genero } from 'src/genero/entities/genero.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Anime {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  titulo: string;

  @Column()
  produtora: string;

  @Column()
  temporadas: number;

  @Column()
  episodios: number;

  @Column()
  nota: number;

  @ManyToOne(() => Genero, (genero) => genero.animes)
  @JoinTable()
  genero: Genero;

  @Column({ default: false})
  destaque?: boolean;

  @Column('text')
  capa: string;

  @ManyToMany(() => UserEntity, (user) => user.animes)
  users: UserEntity[];

  @OneToMany(()=> FavoriteEpisode, (favoriteEpisodes)=>favoriteEpisodes.anime)
  favoriteEpisodes?: FavoriteEpisode[]
}
