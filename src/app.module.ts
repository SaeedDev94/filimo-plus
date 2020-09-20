import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { urlConfig } from './config/url.config';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [urlConfig]
    }),
    AuthModule,
    HomeModule
  ],
})
export class AppModule {}
