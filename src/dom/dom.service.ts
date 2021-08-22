import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import {
  IHome,
  IList,
  IListHead,
  IListItem,
  IMovie,
  IMovieDescription,
  IMovieSeries,
  ITag,
  IUser,
} from './dom.interface';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DomService {
  constructor(private http: HttpService, private config: ConfigService) {}

  private getDocument(html: string): Document {
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  private listHead(section: Element): IListHead {
    const titleElement: Element = section.querySelector('.list-title .title');
    const linkElement: Element = titleElement
      ? titleElement.querySelector('a')
      : null;
    const title: string = titleElement ? titleElement.textContent.trim() : '';
    const link: string = linkElement ? linkElement.getAttribute('href') : '';
    return {
      title,
      tag: link.split('/').pop(),
    };
  }

  private listItems(nodes: NodeListOf<Element>): IListItem[] {
    const data: IListItem[] = [];
    nodes.forEach((item: Element) => {
      const imageElement: Element = item.querySelector('img.ds-media_image');
      if (!imageElement) {
        return;
      }
      const title: string = imageElement.getAttribute('alt');
      const descriptionElement: Element = item.querySelector(
        '.ds-thumb_content_bottom',
      );
      descriptionElement.removeChild(
        descriptionElement.querySelector('.ds-badges'),
      );
      data.push({
        id: item.getAttribute('data-uid'),
        image: imageElement.getAttribute('data-src'),
        title,
        description: descriptionElement.textContent
          .trim()
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => !!item.trim())
          .join(' ')
          .replace(title, '')
          .trim(),
      } as IListItem);
    });
    return data;
  }

  private getList(section: Element): IList {
    return {
      head: this.listHead(section),
      items: this.listItems(section.querySelectorAll('.list-content .item')),
    };
  }

  private lists(document: Document): IList[] {
    const lists: IList[] = [];
    document
      .querySelectorAll('section.list-item.list-thumbnail')
      .forEach((section: Element) => {
        lists.push(this.getList(section));
      });
    return lists;
  }

  private nextLink(document: Document) {
    return (
      document.querySelector('#pageLoadMore')?.getAttribute('data-href') || ''
    );
  }

  getHtml(path: string, setAjaxHeader = false): Promise<string> {
    const headers = this.http.axiosRef.defaults.headers;
    if (setAjaxHeader) {
      headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return this.http
      .get<string>(path, {
        responseType: 'text',
        baseURL: this.config.get('url.filimo'),
        headers,
      })
      .pipe(map((response) => response.data))
      .toPromise();
  }

  authenticated(html: string): boolean {
    return !![...html.matchAll(/user\.username='(.*)';uxEvents\.user\.name/g)]
      .map((i) => i[1])
      .pop();
  }

  home(html: string, index: boolean): IHome {
    const document = this.getDocument(html);
    const home: IHome = {
      lists: this.lists(document),
      next: this.nextLink(document),
    };
    if (index) {
      home.search = [...html.matchAll(/SEARCH_URL="(.*)",SEARCH_ANALYTIC_URL/g)]
        .map((i) => i[1])
        .pop();
      home.user = {
        id: [...html.matchAll(/user\.userId=(.*);uxEvents\.user\.userLang/g)]
          .map((i) => i[1])
          .pop(),
        name: [...html.matchAll(/user\.name='(.*)';uxEvents\.user\.email/g)]
          .map((i) => i[1])
          .pop(),
        mobile: [
          ...html.matchAll(/user\.mobile='(.*)';uxEvents\.user\.fmobile/g),
        ]
          .map((i) => i[1])
          .pop(),
      } as IUser;
      home.special = (() => {
        let list: IList = null;
        const sections = document.querySelectorAll(
          'section.list-item.list-thumbplay',
        );
        if (sections.length > 0) {
          list = this.getList(sections[0]);
        }
        return list;
      })() as IList;
    }
    return home;
  }

  tag(html: string, index: boolean, slug?: string): ITag {
    const document = this.getDocument(html);
    const tag: ITag = {
      slug,
      next: this.nextLink(document),
    };
    const lists: IList[] = this.lists(document);
    if (index) {
      tag.multiSection = lists.length >= 2;
    }
    if (lists.length > 0) {
      tag.lists = lists;
      return tag;
    }
    tag.listItems = this.listItems(document.querySelectorAll('.item'));
    return tag;
  }

  movie(html: string): IMovie {
    const document = this.getDocument(html);
    //
    const playLinkElement = document.querySelector(
      '.movie-actions .left-side a#moreinfo_login',
    );
    const id: string = playLinkElement
      ? playLinkElement.getAttribute('href').split('/').pop()
      : '';
    //
    const titleElement = document.querySelector(
      '.movie-single .movie-title .fa',
    );
    const title: string = titleElement ? titleElement.textContent.trim() : '';
    //
    const descriptions: IMovieDescription[] = (() => {
      const data: IMovieDescription[] = [];
      document
        .querySelectorAll('.section-gallery .gallery_each-movie')
        .forEach((container: Element) => {
          const descriptionTitleElement = container.querySelector(
            '.gallery_each-movie_title',
          );
          const descriptionTextElement = container.querySelector('p');
          if (descriptionTitleElement && descriptionTextElement) {
            data.push({
              title: descriptionTitleElement.textContent.trim(),
              text: descriptionTextElement.textContent.trim(),
            } as IMovieDescription);
          }
        });
      return data;
    })();
    //
    const coverElement = document.querySelector('.movie-single .single-intro');
    const cover: string = coverElement
      ? (coverElement as any).style.backgroundImage
          .slice(4, -1)
          .replace(/['"]/g, '')
      : '';
    //
    const imageElement = document.querySelector(
      '.movie-single .movie-poster img',
    );
    const image: string = imageElement
      ? imageElement.getAttribute('data-src')
      : '';
    //
    let director = '';
    const directorElement: Element = document.querySelector(
      '.movie-single .movie-director',
    );
    if (directorElement) {
      director = directorElement.textContent
        .trim()
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => !!item.trim())
        .join(' ');
    }
    //
    const suggestions: IList = this.lists(document)[0];
    //
    const series: IMovieSeries[] = (() => {
      const data: IMovieSeries[] = [];
      document
        .querySelectorAll('.section-episodes .accordion-item')
        .forEach((container) => {
          const episodeTitleElement = container.querySelector('.right .title');
          const episodeLinkElement = container.querySelector('.left a');
          if (episodeTitleElement && episodeLinkElement) {
            data.push({
              id: episodeLinkElement.getAttribute('href').split('/').pop(),
              title: episodeTitleElement.textContent.trim(),
            } as IMovieSeries);
          }
        });
      return data;
    })();
    //
    return {
      id,
      title,
      descriptions,
      cover,
      image,
      director,
      suggestions,
      series,
    };
  }
}
