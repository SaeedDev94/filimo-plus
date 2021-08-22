import { Injectable } from '@nestjs/common';
import { DownloadService } from '../download/download.service';
import { ConfigService } from '@nestjs/config';
import { IPlay, IPlayPayload } from './play.interface';
import {
  IDownloadRequest,
  IMovieDownload,
} from '../download/download.interface';
import { ResponseType, AxiosResponse } from 'axios';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PlayService {
  constructor(
    private http: HttpService,
    private config: ConfigService,
    private downloadService: DownloadService,
  ) {}

  private appBaseUrl = this.config.get('url.app');

  private getProxyLink(
    url: string,
    responseType: ResponseType = 'arraybuffer',
  ): string {
    return (
      `${this.appBaseUrl}/play/proxy` +
      `?url=${encodeURIComponent(url)}` +
      `&responseType=${responseType}`
    );
  }

  getData<T>(
    url: string,
    responseType: ResponseType,
  ): Promise<AxiosResponse<T>> {
    return this.http
      .get<T>(url, {
        responseType,
      })
      .toPromise();
  }

  playlist(baseUrl: string, data: string): string {
    let playlist = data;
    const replaceWithProxyLink = (uri) => {
      playlist = playlist.replace(uri, this.getProxyLink(`${baseUrl}/${uri}`));
    };
    [...playlist.matchAll(/#EXT-X-KEY(.*)URI="(.*)"/g)]
      .map((i) => i[2])
      .forEach(replaceWithProxyLink);
    [...playlist.matchAll(/#EXTINF(.*)\n(.*)/g)]
      .map((i) => i[2])
      .forEach(replaceWithProxyLink);
    return playlist;
  }

  async hls(payload: IPlayPayload, timestamp: string): Promise<IPlay> {
    let download: IMovieDownload = payload.download;
    if (!download) {
      download = await this.downloadService.get(payload.id);
    }
    let playlist = download.playlist;
    const replaceWithPlaylistLink = (url) => {
      const link =
        `${this.appBaseUrl}/play/playlist` +
        `?url=${encodeURIComponent(url)}` +
        `&timestamp=${timestamp}`;
      playlist = playlist.replace(url, link);
    };
    download.tracks.forEach(replaceWithPlaylistLink);
    download.variants.map((i) => i.link).forEach(replaceWithPlaylistLink);
    this.writePlaylist(playlist);
    let subtitle = '';
    if (download.subtitle) {
      subtitle = this.getProxyLink(download.subtitle, 'text');
    }
    return {
      src: `${this.appBaseUrl}/movie/playlist.m3u8?timestamp=${timestamp}`,
      type: 'application/x-mpegURL',
      subtitle,
    };
  }

  file(id: string): IPlay {
    this.downloadService.createMovieDirIfNotExists();
    const movieDir = join(this.downloadService.getMovieDir(), id);
    const infoFile = join(movieDir, 'info.json');
    const info: IDownloadRequest = JSON.parse(
      readFileSync(infoFile).toString(),
    );
    const movieFileName = `${id}_${info.quality || ''}.mp4`;
    const movieFile = join(movieDir, movieFileName);
    if (!existsSync(movieFile)) {
      throw new Error('Movie file not found');
    }
    let subtitle = '';
    if (info.subtitle) {
      subtitle = this.getProxyLink(info.subtitle, 'text');
    }
    return {
      src: `${this.appBaseUrl}/movie/${id}/${movieFileName}`,
      type: 'video/mp4',
      subtitle,
    };
  }

  private writePlaylist(content: string): void {
    this.downloadService.createMovieDirIfNotExists();
    const playlistFile = join(
      this.downloadService.getMovieDir(),
      'playlist.m3u8',
    );
    writeFileSync(playlistFile, content);
  }
}
