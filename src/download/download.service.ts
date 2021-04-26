import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  statSync,
  writeFileSync
} from 'fs';
import { IDownload, IDownloadRequest, IMovieDownload, IMovieDownloadVariant } from './download.interface';
import { map } from 'rxjs/operators';
import { exec } from 'child_process';

@Injectable()
export class DownloadService {

  constructor(
    private http: HttpService,
    private config: ConfigService
  ) {
  }

  private movieDir: string = join(process.cwd(), 'movie');

  private getText(url: string): Promise<string> {
    return this.http.get<string>(url, {
      responseType: 'text'
    }).pipe(
      map((response) => response.data)
    ).toPromise();
  }

  getMovieDir(): string {
    return this.movieDir;
  }

  createMovieDirIfNotExists(): void {
    if (!existsSync(this.movieDir)) {
      mkdirSync(this.movieDir);
    }
  }

  async get(id: string): Promise<IMovieDownload> {
    const html = await this.getText(`${this.config.get('url.filimo')}/w/${id}`);
    const playerData = JSON.parse(
      [...html.matchAll(/var player_data=(.*);if/g)].map(i => i[1]).pop()
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

  async request(download: IDownloadRequest): Promise<void> {
    this.createMovieDirIfNotExists();
    const movieDir = join(this.movieDir, download.id);
    const dlLock = join(this.movieDir, 'dl.lock');
    const infoFile = join(movieDir, 'info.json');
    const logFile = join(movieDir, 'log.txt');
    const videoFile = join(movieDir, `${download.id}_${download.quality}.mp4`);
    const subtitleFile = join(movieDir, `${download.id}.srt`);
    if (existsSync(dlLock)) {
      throw new Error('You have another download process in background');
    }
    if (!existsSync(movieDir)) {
      mkdirSync(movieDir);
    }
    writeFileSync(infoFile, JSON.stringify(download));
    if (download.subtitle) {
      let subtitle = await this.getText(download.subtitle);
      subtitle = subtitle.replace('WEBVTT', '').trim() + '\n';
      writeFileSync(subtitleFile, subtitle);
    }
    if (process.platform === 'win32') {
      exec(`start /B ${process.cwd()}\\dl.bat "${download.link}" "${videoFile}" "${download.tracks[0] || ''}" "${download.tracks[1] || ''}" <nul >nul 2> "${logFile}"`, (error) => {
        if (error) {
          console.log('Windows bat run error:', error);
        }
      });
    } else {
      exec(`bash ${process.cwd()}/dl.bash "${download.link}" "${videoFile}" "${logFile}" "${download.tracks[0] || ''}" "${download.tracks[1] || ''}"`, (error) => {
        if (error) {
          console.log('Linux bash run error:', error);
        }
      });
    }
  }

  cancel(id: string): void {
    const dlLock = join(this.movieDir, 'dl.lock');
    const movieDir = join(this.movieDir, id);
    //
    if (existsSync(dlLock)) {
      if (process.platform === 'win32') {
        exec(`TaskKill /IM ffmpeg.exe /F`, (error) => {
          if (error) {
            console.log('Windows TaskKill error:', error);
          }
        });
      } else {
        const strPid = readFileSync(dlLock).toString().trim();
        const pid = Number(strPid) || 0;
        if (pid) {
          exec(`kill "${pid}"`, (error) => {
            if (error) {
              console.log('Linux kill pid error:', error);
            }
          });
        }
      }
    }
    //
    if (existsSync(movieDir)) {
      rmdirSync(movieDir, {
        recursive: true
      });
    }
  }

  list(): IDownload[] {
    this.createMovieDirIfNotExists();
    const list: IDownload[] = [];
    readdirSync(this.movieDir, {withFileTypes: true})
      .filter(item => item.isDirectory())
      .map((dir) => {
        return {
          name: dir.name,
          timestamp: statSync(`${this.movieDir}/${dir.name}`).mtime.valueOf()
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((dir) => {
        const infoFile = join(this.movieDir, dir.name, 'info.json');
        const logFile = join(this.movieDir, dir.name, 'log.txt');
        if (!existsSync(infoFile) || !existsSync(logFile)) {
          return;
        }
        const info = JSON.parse(readFileSync(infoFile).toString());
        const progress = this.calcDownloadProgress(readFileSync(logFile).toString());
        list.push(Object.assign(info, {
          progress,
          movie: `/movie/${dir.name}/${dir.name}_${info.quality || ''}.mp4`,
          subtitle: info.subtitle ? `/movie/${dir.name}/${dir.name}.srt` : ''
        }) as IDownload);
      });
    return list;
  }

  private calcDownloadProgress(log: string): number {
    let totalDuration = 0;
    const strTotalDuration = [...log.matchAll(/Duration: (.*), start:/g)].map(i => i[1]).pop();
    if (strTotalDuration) {
      totalDuration = this.strTimeToSeconds(strTotalDuration);
    }
    //
    let currentTime = 0;
    const strCurrentTime = [...log.matchAll(/time=(.*) bitrate/g)].map(i => i[1]).pop();
    if (strCurrentTime) {
      currentTime = this.strTimeToSeconds(strCurrentTime);
    }
    //
    const floatProgress = (currentTime / (totalDuration ? totalDuration : 1)) * 100;
    const intProgress = Math.round(floatProgress);
    return intProgress > 100 ? 100 : intProgress;
  }

  private strTimeToSeconds(time: string): number {
    let seconds = 0;
    const timeParts = time.split(':');
    const secondText = timeParts.pop();
    seconds += secondText ? (Number(secondText) || 0) : 0;
    const minuteText = timeParts.pop();
    seconds += minuteText ? ((Number(minuteText) || 0) * 60) : 0;
    const hourText = timeParts.pop();
    seconds += hourText ? ((Number(hourText) || 0) * 60 * 60) : 0;
    return seconds;
  }
}
