import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [configuration]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public')
    })
  ],
})
export class AppModule {}
