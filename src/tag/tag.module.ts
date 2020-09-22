import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { DomModule } from '../dom/dom.module';

@Module({
  imports: [
    DomModule
  ],
  controllers: [
    TagController
  ]
})
export class TagModule {}
