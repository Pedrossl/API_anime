import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './user/entity/user.entity';
import { AnimeModule } from './anime/anime.module';
import { GeneroModule } from './genero/genero.module';
import { Anime } from './anime/entities/anime.entity';
import { Genero } from './genero/entities/genero.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { FavoriteEpisodeModule } from './favorite-episode/favorite-episode.module';
import { FavoriteEpisode } from './favorite-episode/entities/favorite-episode.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        auth: {
          user: "3b00f8cecc3986",
          pass: "4a9bd6add94f9e"
        },
      },
      defaults: {
        from: '"AnimeCom" <3b00f8cecc3986>'
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: process.env.DB_TYPE as 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [UserEntity,Anime,Genero,FavoriteEpisode],
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        logging: process.env.TYPEORM_LOGGING === 'false',
        //quando rodar a primiera vez, deixar false, depois mudar para true
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      }),
    }),
    UserModule,
    AuthModule,
    AnimeModule,
    GeneroModule,
    FavoriteEpisodeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
