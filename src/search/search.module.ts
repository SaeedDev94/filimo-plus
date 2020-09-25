import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SharedModule } from '../shared/shared.module';
import { SearchService } from './search.service';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [
    SearchController
  ],
  providers: [
    SearchService
  ]
})
export class SearchModule {}
