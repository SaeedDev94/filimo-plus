import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { DownloadService } from './download.service';
import { IDownload, IDownloadRequest } from './download.interface';
import { WrapResponseInterceptor } from '../shared/wrap-response.interceptor';

@Controller('download')
export class DownloadController {
  constructor(private downloadService: DownloadService) {}

  @Post('request')
  @UseInterceptors(WrapResponseInterceptor)
  async request(@Body() payload: IDownloadRequest) {
    await this.downloadService.request(payload);
    return null;
  }

  @Post('cancel')
  @UseInterceptors(WrapResponseInterceptor)
  cancel(@Body('id') id: string) {
    this.downloadService.cancel(id);
    return null;
  }

  @Post('list')
  @UseInterceptors(WrapResponseInterceptor)
  list(): IDownload[] {
    return this.downloadService.list();
  }
}
