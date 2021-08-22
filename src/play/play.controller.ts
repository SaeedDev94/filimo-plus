import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { WrapResponseInterceptor } from '../shared/wrap-response.interceptor';
import { IPlay, IPlayPayload } from './play.interface';
import { PlayService } from './play.service';
import { Response } from 'express';
import { URL } from 'url';
import { ResponseType } from 'axios';

@Controller('play')
export class PlayController {
  constructor(private playService: PlayService) {}

  private static sendResponse(
    response: Response,
    data: string | Buffer,
    contentType: string,
    fileName: string,
  ): void {
    response.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename=${fileName}`,
    });
    response.write(data);
    response.end();
  }

  @Get('proxy')
  async proxy(@Res() res: Response, @Query() query: any): Promise<void> {
    const url = decodeURIComponent(query.url);
    const responseType: ResponseType = query.responseType || 'arraybuffer';
    const fileName = new URL(url).pathname.split('/').pop();
    let data: string | Buffer;
    let contentType: string;
    if (responseType === 'arraybuffer') {
      const response = await this.playService.getData<ArrayBuffer>(
        url,
        responseType,
      );
      data = Buffer.from(response.data);
      contentType = response.headers['content-type'];
    } else {
      const response = await this.playService.getData<string>(
        url,
        responseType,
      );
      data = response.data;
      contentType = response.headers['content-type'];
    }
    PlayController.sendResponse(res, data, contentType, fileName);
  }

  @Get('playlist')
  async playlist(@Res() res: Response, @Query() query: any): Promise<void> {
    const url = decodeURIComponent(query.url);
    const urlParts = url.split('/');
    urlParts.pop();
    const baseUrl = urlParts.join('/');
    const fileName = new URL(url).pathname.split('/').pop();
    const response = await this.playService.getData<string>(url, 'text');
    const data = this.playService.playlist(baseUrl, response.data);
    const contentType = 'application/x-mpegURL';
    PlayController.sendResponse(res, data, contentType, fileName);
  }

  @Post('hls')
  @UseInterceptors(WrapResponseInterceptor)
  hls(
    @Body() payload: IPlayPayload,
    @Query('timestamp') timestamp: string,
  ): Promise<IPlay> {
    return this.playService.hls(
      payload,
      timestamp || `${new Date().valueOf()}`,
    );
  }

  @Post('file')
  @UseInterceptors(WrapResponseInterceptor)
  file(@Body('id') id: string): IPlay {
    return this.playService.file(id);
  }
}
