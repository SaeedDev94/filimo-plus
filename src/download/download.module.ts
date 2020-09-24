import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { SharedModule } from '../shared/shared.module';
import { DownloadController } from './download.controller';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [
    DownloadController
  ],
  providers: [
    DownloadService
  ],
  exports: [
    DownloadService
  ]
})
export class DownloadModule {}
