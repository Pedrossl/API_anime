import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoriteEpisodeService } from './favorite-episode.service';
import { CreateFavoriteEpisodeDto } from './dto/create-favorite-episode.dto';
import { UpdateFavoriteEpisodeDto } from './dto/update-favorite-episode.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { IsPublic } from 'src/decorators/is-public.decorator';

@Controller('favorite-episode')
export class FavoriteEpisodeController {
  constructor(private readonly favoriteEpisodeService: FavoriteEpisodeService) {}

  @Post(':animeId')
  create( @Param('animeId') animeId: number, @CurrentUser() user: UserEntity,
  @Body() createFavoriteEpisodeDto: CreateFavoriteEpisodeDto,
   ) {
    return this.favoriteEpisodeService.create(
      animeId,
      user.id,
      createFavoriteEpisodeDto.episode,
    );
  }

  @Get()
  findAll() {
    return this.favoriteEpisodeService.findAll();
  }

 /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoriteEpisodeService.findOne(+id);
  }*/

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoriteEpisodeDto: UpdateFavoriteEpisodeDto) {
    return this.favoriteEpisodeService.update(+id, updateFavoriteEpisodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoriteEpisodeService.remove(+id);
  }

  @IsPublic()
  @Get('popular')
  findPopularEpisodes() {
    return this.favoriteEpisodeService.findPopularEpisodes();
  }
}
