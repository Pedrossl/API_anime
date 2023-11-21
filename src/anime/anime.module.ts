import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from './entities/anime.entity';
import { Genero } from 'src/genero/entities/genero.entity';
import { FavoriteEpisode } from 'src/favorite-episode/entities/favorite-episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anime, Genero,FavoriteEpisode])],
  controllers: [AnimeController],
  providers: [AnimeService],
})
export class AnimeModule {}
