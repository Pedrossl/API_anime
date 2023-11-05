import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUserEnum } from '../enums/role-user.enum';



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

}
