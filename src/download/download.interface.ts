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
