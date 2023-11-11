import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Anime } from 'src/anime/entities/anime.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Anime)
    private animeRepository: Repository<Anime>,
    private readonly mailerservice: MailerService,
  ) {}

  async createUser(body: CreateUserDTO): Promise<UserEntity> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: body.email,
        },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const saltRounds = 15;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(body.password, salt);

      const userToCreate: Omit<UserEntity, 'id'> = {
        ...body,
        password: hashedPassword,
      };

      return await this.userRepository.save(userToCreate);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async addAnimeToUser(animeId: number, userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['animes'],
    });
    const anime = await this.animeRepository.findOne({
      where: { id: animeId },
    });

    if (!anime) {
      throw new BadRequestException('Anime not found');
    }
    if (user?.animes?.length < 1) {
      user.animes = [];
    }
    user.animes.push(anime);
    return this.userRepository.save(user);
  }

  async removeAnimeFromUser(
    animeId: number,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['animes'],
    });
    const anime = await this.animeRepository.findOne({
      where: { id: animeId },
    });

    if (!anime) {
      throw new BadRequestException('Anime not found in your list');
    }

    user.animes = user.animes.filter((anime) => anime.id !== animeId);
    return this.userRepository.save(user);
  }
  
  async showUserAnimeList(userId: number): Promise<UserEntity> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.animes', 'anime')
    .leftJoinAndSelect('anime.genero', 'genero')
    .select(['user.name', 'user.id', 'anime.titulo', 'genero.nome','anime.id','genero.id'])
    .where('user.id = :id', { id: userId })
    .getOne();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async sendEmail(): Promise<boolean> {
   await this.mailerservice.sendMail({
      to:'NotasBrasil@ritogames.com',
      from: 'ASHASHASH@banana.com',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      html: '<b>welcome</b>',
    }
    
    )
    return true
    /*.then(() => {
      console.log('email sent');
    }
    ).catch((error) => {
      console.log(error);
    });*/
    
  }
}
