import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { urlConfig } from './config/url.config';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { TagModule } from './tag/tag.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [urlConfig]
    }),
    AuthModule,
    HomeModule,
    TagModule,
    MovieModule
  ],
})
export class AppModule {}
