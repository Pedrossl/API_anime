import { IsInt } from "class-validator";

export class CreateFavoriteEpisodeDto {
    @IsInt()
    episode: number;
}
