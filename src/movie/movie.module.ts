import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { DomModule } from '../dom/dom.module';

@Module({
  imports: [
    DomModule
  ],
  controllers: [
    MovieController
  ]
})
export class MovieModule {}
