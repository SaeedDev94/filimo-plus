import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { DomModule } from '../dom/dom.module';
import { DownloadModule } from '../download/download.module';

@Module({
  imports: [
    DomModule,
    DownloadModule
  ],
  controllers: [
    MovieController
  ]
})
export class MovieModule {}
