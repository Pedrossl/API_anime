import { Module } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Anime } from 'src/anime/entities/anime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Anime])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
