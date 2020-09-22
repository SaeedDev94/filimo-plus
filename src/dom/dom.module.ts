import { Module } from '@nestjs/common';
import { DomService } from './dom.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  providers: [
    DomService
  ],
  exports: [
    SharedModule,
    DomService
  ]
})
export class DomModule {}
