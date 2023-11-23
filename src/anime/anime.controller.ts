import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { IsPublic } from 'src/decorators/is-public.decorator';

@Controller('animes')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Post()
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  
  @IsPublic()
  @Get()
  findAll() {
    return this.animeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animeService.findOne(+id);
  }

  @Patch('/note/:id')
  updateRating(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ) {

    return this.animeService.updateRating(id, updateAnimeDto.nota);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animeService.remove(+id);
  }
  
  @Patch('/destaque/:id')
  updateDestaque(@Param('id', ParseIntPipe) id: number) {
    return this.animeService.updateDestaque(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAnimeDto: UpdateAnimeDto) {
    return this.animeService.update(id, updateAnimeDto);
  }
}
