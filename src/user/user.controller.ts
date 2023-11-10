import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { UserService } from './user.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity) private model: Repository<UserEntity>,
    private userService: UserService,
  ) {}

  @IsPublic()
  @Post()
  async create(@Body() body: CreateUserDTO): Promise<{ data: UserEntity }> {
    try {
      const user = await this.userService.createUser(body);
      return { data: user };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<{ data: UserEntity[] }> {
    const list = await this.model.find();
    return { data: list };
  }

  @Post('/add-anime/:animeId')
  async addAnimeToUser(
    @Param('animeId') animeId: number,
    @CurrentUser() user: UserEntity,
  ): Promise<UserEntity> {
    return this.userService.addAnimeToUser(animeId, user.id);
  }
}
