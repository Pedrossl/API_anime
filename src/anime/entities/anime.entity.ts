import { Genero } from 'src/genero/entities/genero.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @ManyToMany(() => UserEntity, (user) => user.animes)
  @JoinTable()
  users: UserEntity[];
}
