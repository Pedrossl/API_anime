import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserToken } from 'src/user/interfaces/UserToken';
import { UserPayload } from 'src/user/interfaces/userPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userController: UserService,
    private JwtService: JwtService,
  ) {}
  login(user: UserEntity): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id,
    };
    const token = this.JwtService.sign(payload);
    return {
      accessToken: token,
      user:user.name,
      role:user.role,
      id:user.id,
      email: user.email,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userController.findByEmail(email);

    if (user) {
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        return { ...user, password: undefined };
      }
    }
    throw new Error('Invalid email or password');
  }
}
