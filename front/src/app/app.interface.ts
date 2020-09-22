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
  slug: string;
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

export interface IMovie {
  id: string;
  originalId?: string;
  title: string;
  descriptions: Array<{
    title: string;
    text: string;
  }>;
  cover: string;
  image: string;
  director: string;
  suggestions: IList;
  series: Array<{
    id: string;
    title: string;
  }>;
  download: {
    subtitle: string;
    variants: Array<{
      quality: string;
      resolution: string;
      link: string;
    }>;
    tracks: Array<string>;
    playlist: string;
  };
}

export interface IDownloadRequest {
  link: string;
  id: string;
  title: string;
  quality: string;
  resolution: string;
  subtitle: string;
  image: string;
  tracks: Array<string>;
}

export interface IDownload {
  id: string;
  image: string;
  title: string;
  quality: string;
  resolution: string;
  movie: string;
  subtitle: string;
  progress: number;
  deleted?: boolean;
}

export interface IPlay {
  src: string;
  type: string;
  subtitle: string;
}
