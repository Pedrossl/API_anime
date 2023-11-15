import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleUserEnum } from '../enums/role-user.enum';
import { Anime } from 'src/anime/entities/anime.entity';

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

  @Column({ default: null, nullable: true })
  code?: string;

  @ManyToMany(() => Anime, (anime) => anime.users)
  @JoinTable()
  animes?: Anime[];
}
