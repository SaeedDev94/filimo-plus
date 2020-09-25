import { IMovieDownload } from '../download/download.interface';

export interface IPlayPayload {
  id: string;
  download?: IMovieDownload;
}

export interface IPlay {
  src: string;
  type: string;
  subtitle: string;
}
