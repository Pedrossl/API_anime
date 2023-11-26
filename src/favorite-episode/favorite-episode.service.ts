import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
    
      if (!anime || !user) {
        throw new NotFoundException('Anime ou usuário não encontrado.');
      }
    
      const existingFavorite = await this.favoriteEpisodeRepository.findOne({
        where: { anime, user },
      });
    
      if (existingFavorite) {
        throw new HttpException('O usuário já escolheu um episódio para este anime.', 403);
      }
    
      if (anime.episodios <= episode) {
        throw new HttpException('O episódio especificado não existe para o anime fornecido.', 403);
      }
    
      const favoriteEpisode = this.favoriteEpisodeRepository.create({ anime, user, episode });
      return await this.favoriteEpisodeRepository.save(favoriteEpisode);
    }

    async findAll() {
      const favoriteEpisodes = await this.favoriteEpisodeRepository
        .createQueryBuilder('favoriteEpisode')
        .leftJoinAndSelect('favoriteEpisode.anime', 'anime')
        .leftJoinAndSelect('favoriteEpisode.user', 'user')
        .getMany();
  
      if (!favoriteEpisodes) {
        throw new NotFoundException('Não existem episódios favoritos.');
      }
  
      return favoriteEpisodes;
    }


  update(id: number, updateFavoriteEpisodeDto: UpdateFavoriteEpisodeDto) {
    return `This action updates a #${id} favoriteEpisode`;
  }

async remove(id: number) {
  const favoriteEpisode = await this.favoriteEpisodeRepository.findOne({ where: { id } });
  if(!favoriteEpisode) {
    throw new HttpException('O episódio favorito não existe.', 403);
  }
  return this.favoriteEpisodeRepository.delete(favoriteEpisode);
}

async findPopularEpisodes() {
  const popularEpisodes = await this.favoriteEpisodeRepository
    .createQueryBuilder('favoriteEpisode')
    .select([
      'favoriteEpisode.episode',
      'COUNT(DISTINCT favoriteEpisode.user) as userCount', 
      'anime.id as animeId',
      'anime.titulo as animeTitulo',
    ])
    .innerJoin('favoriteEpisode.anime', 'anime')
    .groupBy('favoriteEpisode.episode, anime.id')
    .orderBy('userCount', 'DESC') 
    .addOrderBy('favoriteEpisode.episode', 'ASC') 
    .getRawMany();


  if (!popularEpisodes) {
    throw new NotFoundException('Não existem episódios favoritos.');
  }

  return popularEpisodes;
}

}
