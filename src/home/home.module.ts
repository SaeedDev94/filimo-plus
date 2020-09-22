import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { DomModule } from '../dom/dom.module';

@Module({
  imports: [
    DomModule
  ],
  controllers: [
    HomeController
  ]
})
export class HomeModule {}
