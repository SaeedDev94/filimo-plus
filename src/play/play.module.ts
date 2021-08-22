import { Module } from '@nestjs/common';
import { PlayController } from './play.controller';
import { SharedModule } from '../shared/shared.module';
import { DownloadModule } from '../download/download.module';
import { PlayService } from './play.service';

@Module({
  imports: [SharedModule, DownloadModule],
  controllers: [PlayController],
  providers: [PlayService],
})
export class PlayModule {}
