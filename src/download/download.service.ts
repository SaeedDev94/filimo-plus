import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { IMovieDownload, IMovieDownloadVariant } from './download.interface';
import { map } from 'rxjs/operators';

@Injectable()
export class DownloadService {

  constructor(
    private http: HttpService,
    private config: ConfigService
  ) {
  }

  private movieDir = join(process.cwd(), 'public', 'movie');

  private createMovieDirIfNotExists(): void {
    if (!existsSync(this.movieDir)) {
      mkdirSync(this.movieDir);
    }
  }

  private getText(url: string): Promise<string> {
    return this.http.get<string>(url, {
      responseType: 'text'
    }).pipe(
      map((response) => response.data)
    ).toPromise();
  }

  async get(id: string): Promise<IMovieDownload> {
    const html = await this.getText(`${this.config.get('url.filimo')}/w/${id}`);
    const playerData =  JSON.parse(
      [...html.matchAll(/var player_data = (.*);/g)].map(i => i[1]).pop()
    );
    let playlistUrl = '';
    const multiSRC = playerData.multiSRC || [];
    multiSRC.forEach((item) => {
      item.forEach((source) => {
        if (!playlistUrl && source.type === 'application/vnd.apple.mpegurl') {
          playlistUrl = source.src;
        }
      });
    });
    const playlist = await this.getText(playlistUrl);
    const variants: IMovieDownloadVariant[] = [...playlist.matchAll(/#([0-9]+(.*?))\n(.*)RESOLUTION=(.*)\n(.*)/g)].map((variant) => {
      return {
        quality: variant[1] || '',
        resolution: variant[4] ? variant[4].split(',')[0] : '',
        link: variant[5] || ''
      } as IMovieDownloadVariant;
    });
    const tracks: string[] = [...playlist.matchAll(/GROUP-ID="audio"(.*)URI="(.*)"/g)].slice(0, 2).map(i => i[2]);
    let subtitle = '';
    (playerData.tracks || []).forEach((track) => {
      if (!subtitle && track.srclang === 'fa') {
        subtitle = track.src;
      }
    });
    return {
      variants,
      subtitle,
      tracks: (playerData.multiAudio && tracks.length >= 2) ? tracks : [],
      playlist
    };
  }

  request() {
    this.createMovieDirIfNotExists();
    // TODO
  }

  cancel() {
    // TODO
  }

  list() {
    // TODO
  }
}
