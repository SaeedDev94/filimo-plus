import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  providers: [
    DownloadService
  ],
  exports: [
    DownloadService
  ]
})
export class DownloadModule {}
