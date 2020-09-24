export interface IMovieDownloadVariant {
  quality: string;
  resolution: string;
  link: string;
}

export interface IMovieDownload {
  variants: IMovieDownloadVariant[];
  subtitle: string;
  tracks: string[];
  playlist: string;
}

export interface IDownloadRequest {
  link: string;
  id: string;
  title: string;
  quality: string;
  resolution: string;
  subtitle: string;
  image: string;
  tracks: string[];
}

export interface IDownload extends IDownloadRequest {
  progress: number;
  movie: string;
}
