import { Module } from '@nestjs/common';
import { FavoriteEpisodeService } from './favorite-episode.service';
import { FavoriteEpisodeController } from './favorite-episode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEpisode } from './entities/favorite-episode.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Anime } from 'src/anime/entities/anime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Anime, UserEntity,FavoriteEpisode])],
  controllers: [FavoriteEpisodeController],
  providers: [FavoriteEpisodeService],
})
export class FavoriteEpisodeModule {}
