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

export interface IMovieDescription {
  title: string;
  text: string;
}

export interface IEpisode {
  id: string;
  title: string;
}

export interface IMovie<T = any> {
  id: string;
  slug?: string;
  title: string;
  descriptions: IMovieDescription[];
  cover: string;
  image: string;
  director: string;
  suggestions: IList;
  series: IEpisode[];
  download?: T;
}
