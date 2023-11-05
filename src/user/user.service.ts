import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(body: CreateUserDTO): Promise<UserEntity> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: body.email,
        },
      });
      
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const saltRounds = 15;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(body.password, salt);

      const userToCreate: Omit<UserEntity, 'id'> = {
        ...body,
        password: hashedPassword,
      };
      

      return await this.userRepository.save(userToCreate);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}




