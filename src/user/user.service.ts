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
import { RoleUserEnum } from './enums/role-user.enum';

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

  async sendEmail(userEmail: string): Promise<string> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
  
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const user = await this.userRepository.findOne({ where: { email: userEmail } });
  
      if (!user) {
        await queryRunner.rollbackTransaction();
        return 'Usuário não encontrado';
      }
  
      const code = Math.floor(Math.random() * 1000000) + 1;
      user.code = code.toString();
  
      await this.mailerservice.sendMail({
        to: user.email,
        from: 'Suporte@AnimeCom.com',
        subject: 'Testing Nest MailerModule ✔',
        text: 'Bem-vindo',
        html: `<b>Bem-vindo</b> <p>Seu código de verificação é: ${code}</p>`,
      });
  
      await this.userRepository.save(user);
      await queryRunner.commitTransaction();
  
      console.log('Email enviado e código salvo');
      return 'Código enviado para o email';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return 'Erro ao enviar email, tente novamente mais tarde';
    } finally {
      await queryRunner.release();
    }
  }

  async verifyCode(code: string, userEmail: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });

    if(user.role !== RoleUserEnum.newUser){
      return 'Usuario não é mais um novo usuario';
     }
     console.log(user.role);
     

    const userCode = user?.code;
    console.log(userCode);
    
    if (userCode === code) {
      user.role = RoleUserEnum.commonUser;
      user.code = null;
      await this.userRepository.save(user);
      return 'Codigo verificado com sucesso';
    } else {
      return 'Codigo incorreto';
    }
  }
}
