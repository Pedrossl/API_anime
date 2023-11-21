import { HttpException, Injectable } from '@nestjs/common';
import { CreateFavoriteEpisodeDto } from './dto/create-favorite-episode.dto';
import { UpdateFavoriteEpisodeDto } from './dto/update-favorite-episode.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Anime } from 'src/anime/entities/anime.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { FavoriteEpisode } from './entities/favorite-episode.entity';

@Injectable()
export class FavoriteEpisodeService {
  constructor(
    @InjectRepository(Anime)
    private animeRepository: Repository<Anime>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(FavoriteEpisode)
    private favoriteEpisodeRepository: Repository<FavoriteEpisode>,
    ) {}
  async create(anime_id: number, user_id: number, episode: number) {
    const anime = await this.animeRepository.findOne({ where: { id: anime_id } });
    const user = await this.userRepository.findOne({ where: { id: user_id } });

    if(anime.episodios <= episode) {
      throw new HttpException('O episódio especificado não existe para o anime fornecido.', 403);
    }
    
    const favoriteExist = await this.favoriteEpisodeRepository.findOne({
      where: { user: { id: user_id } }
    })

    if(favoriteExist) {
      throw new HttpException('Anime já favoritado', 400);
    }

    const favoriteEpisode = this.favoriteEpisodeRepository.create({ anime, user, episode });
    return await this.favoriteEpisodeRepository.save(favoriteEpisode);

  }

  findAll() {
    return `This action returns all favoriteEpisode`;
  }


  update(id: number, updateFavoriteEpisodeDto: UpdateFavoriteEpisodeDto) {
    return `This action updates a #${id} favoriteEpisode`;
  }

  remove(id: number) {
    return `This action removes a #${id} favoriteEpisode`;
  }
}
