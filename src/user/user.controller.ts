import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
  
  @IsPublic()
  @Get()
  async findAll(): Promise<{ data: UserEntity[] }> {
    const list = await this.model.find();
    return { data: list };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<{ data: UserEntity }> {
    const user = await this.userService.findById(id);
    return { data: user };
  }

  @Post('/add-anime/:animeId')
  async addAnimeToUser(
    @Param('animeId') animeId: number,
    @CurrentUser() user: UserEntity,
  ): Promise<UserEntity> {
    return this.userService.addAnimeToUser(animeId, user.id);
  }

  @Delete('/remove-anime/:animeId')
  async removeAnimeFromUser(
    @Param('animeId') animeId: number,
    @CurrentUser() user: UserEntity,
  ): Promise<UserEntity> {
    return this.userService.removeAnimeFromUser(animeId, user.id);
  }

  @Get('/animesList')
  async getUserAnimes(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return this.userService.showUserAnimeList(user.id);
  }

  @Post('/email')
  async sendEmail(@CurrentUser() user:UserEntity): Promise<string> {    
    return this.userService.sendEmail(user.email);
  }

  @Post('/verify')
  async verifyEmail(@CurrentUser() user:UserEntity, @Body('code') code: string): Promise<string> {
    return this.userService.verifyCode(code,user.email);
  }
}
