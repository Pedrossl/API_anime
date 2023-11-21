import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteEpisodeDto } from './create-favorite-episode.dto';

export class UpdateFavoriteEpisodeDto extends PartialType(CreateFavoriteEpisodeDto) {}
