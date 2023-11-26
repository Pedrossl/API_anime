import { RoleUserEnum } from "../enums/role-user.enum";

export interface UserToken {
  accessToken: string;
  user: string;
  role: RoleUserEnum
  email: string;
  id: number;
}
