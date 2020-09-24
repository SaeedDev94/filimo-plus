export interface IBaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ILoginRequest {
  guid: string;
  tempId: string;
}

export interface ILoginVerify {
  token: string;
}

export interface IUser {
  id: string;
  name: string;
  mobile: string;
}

export interface IListHead {
  title: string;
  tag?: string;
}

export interface IListItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface IList {
  head: IListHead;
  items: IListItem[];
}

export interface IHome {
  search?: string;
  user?: IUser;
  special?: IList;
  lists: IList[];
  next?: string;
}

export interface ITag {
  slug?: string;
  multiSection?: boolean;
  lists?: IList[];
  listItems?: IListItem[];
  next?: string;
}

export interface ISearch {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface IInfiniteScroll {
  runAt?: number;
  disable: boolean;
  loading: boolean;
  callback: () => void;
}

export interface IMovieDescription {
  title: string;
  text: string;
}

export interface IMovieSeries {
  id: string;
  title: string;
}

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

export interface IMovie {
  id: string;
  slug?: string;
  title: string;
  descriptions: IMovieDescription[];
  cover: string;
  image: string;
  director: string;
  suggestions: IList;
  series: IMovieSeries[];
  download?: IMovieDownload;
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
  deleted?: boolean;
}

export interface IPlay {
  src: string;
  type: string;
  subtitle: string;
}
