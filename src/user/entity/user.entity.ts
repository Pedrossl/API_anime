import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleUserEnum } from '../enums/role-user.enum';
import { Anime } from 'src/anime/entities/anime.entity';
import { FavoriteEpisode } from 'src/favorite-episode/entities/favorite-episode.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 70, unique: true })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column({ type: 'enum', enum: RoleUserEnum, default: RoleUserEnum.newUser })
  role?: RoleUserEnum;

  @Column({ default: false, nullable: true })
  code?: string;

  @ManyToMany(() => Anime, (anime) => anime.users)
  @JoinTable()
  animes?: Anime[];

  @OneToMany(() => FavoriteEpisode, (favoriteEpisodes) => favoriteEpisodes.user)
  favoriteEpisodes?: FavoriteEpisode[];
}
