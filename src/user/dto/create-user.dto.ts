import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { RoleUserEnum } from '../enums/role-user.enum';

export class CreateUserDTO {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(70)
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(500)
  password: string;

  @IsString()
  @IsOptional()
  role?: RoleUserEnum;
}
