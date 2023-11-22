import { Injectable } from '@nestjs/common';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { Anime } from './entities/anime.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genero } from 'src/genero/entities/genero.entity';
import { UpdateAnimeDto } from './dto/update-anime.dto';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private animeRepository: Repository<Anime>,
    @InjectRepository(Genero)
    private generoRepository: Repository<Genero>,
  ) {}

  async create(createAnimeDto: CreateAnimeDto) {
    const existeGenero = await this.generoRepository.findOne({
      where: { id: createAnimeDto.genero_id },
    });
    if (!existeGenero) {
      return 'not found';
    }
    const anime = this.animeRepository.create(createAnimeDto);
    anime.genero = existeGenero;
    return await this.animeRepository.save(anime);
  }

  async update(id: number, updateAnimeDto: UpdateAnimeDto) {
    const anime = await this.animeRepository.findOne({ where: { id } });
    if (!anime) {
      return 'not found';
    }
    const existeGenero = await this.generoRepository.findOne({
      where: { id: updateAnimeDto.genero_id },
    });
    if (!existeGenero) {
      return 'not found';
    }
    return this.animeRepository.save({ ...anime, ...updateAnimeDto });
  }

  findAll() {
    return this.animeRepository
      .createQueryBuilder('anime')
      .leftJoinAndSelect('anime.genero', 'genero')
      .getMany();
  }

  async updateRating(id: number, nota: number): Promise<Anime> {
    const anime = await this.animeRepository.findOne({ where: { id } });
    console.log(anime);

    return this.animeRepository.save({ ...anime, nota });
  }
  async findOne(id: number): Promise<Anime | 'not found'> {
    const anime = await this.animeRepository.findOne({ where: { id } });
    if (!anime) {
      return 'not found';
    }
    return anime;
  }

  async remove(id: number) {
    const anime = await this.animeRepository.findOne({ where: { id } });
    if (!anime) {
      return 'not found';
    }

    try {
      await this.animeRepository.delete({ id });
    } catch (error) {
      return { msg: 'Not Found', error };
    }
    return { msg: 'Deleted', id };
  }

  async updateDestaque(id: number): Promise<Anime | 'not found'> {
    const anime = await this.animeRepository.findOne({ where: { id } });
    if (!anime) {
      return 'not found';
    }
    return this.animeRepository.save({ ...anime, destaque: !anime.destaque });
  }
}
