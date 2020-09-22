import { HttpService, Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { IHome, IList, IListHead, IListItem, ITag, IUser } from './dom.interface';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';

@Injectable()
export class DomService {

  constructor(
    private http: HttpService,
    private config: ConfigService
  ) {
  }

  private getDocument(html: string): Document {
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  private listHead(section: Element): IListHead {
    const titleElement: Element = section.querySelector('.list-title .title');
    const linkElement: Element = titleElement ? titleElement.querySelector('a') : null;
    const title: string = titleElement ? titleElement.textContent.trim() : '';
    const link: string = linkElement ? linkElement.getAttribute('href') : '';
    return {
      title,
      tag: link.split('/').pop()
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
      const descriptionElement: Element = item.querySelector('.ds-thumb_content_bottom');
      descriptionElement.removeChild(descriptionElement.querySelector('.ds-badges'));
      data.push({
        id: item.getAttribute('data-uid'),
        image: imageElement.getAttribute('data-src'),
        title,
        description: descriptionElement.textContent
          .trim()
          .split('\n')
          .map(item => item.trim())
          .filter(item => !!item.trim())
          .join(' ')
          .replace(title, '')
          .trim()
      } as IListItem);
    });
    return data;
  }

  private getList(section: Element): IList {
    return {
      head: this.listHead(section),
      items: this.listItems(section.querySelectorAll('.list-content .item'))
    };
  }

  private lists(document: Document): IList[] {
    const lists: IList[] = [];
    document.querySelectorAll('section.list-item.list-thumbnail').forEach((section: Element) => {
      lists.push(this.getList(section));
    });
    return lists;
  }

  private nextLink(document: Document) {
    return document.querySelector('#pageLoadMore')?.getAttribute('data-href') || '';
  }

  getHtml(path: string): Promise<string> {
    return this.http.get<string>(path, {
      responseType: 'text',
      baseURL: this.config.get('url.filimo')
    }).pipe(
      map((response) => response.data)
    ).toPromise();
  }

  authenticated(html: string): boolean {
    return !![...html.matchAll(/user\.username.*= '(.*)'/g)].map(i => i[1]).pop();
  }

  home(html: string, index: boolean): IHome {
    const document = this.getDocument(html);
    const home: IHome = {
      lists: this.lists(document),
      next: this.nextLink(document)
    };
    if (index) {
      home.search = [...html.matchAll(/SEARCH_URL = "(.*)"/g)].map(i => i[1]).pop();
      home.user = {
        id: [...html.matchAll(/user\.userId.*= (.*);/g)].map(i => i[1]).pop(),
        name: [...html.matchAll(/user\.name.*= '(.*)'/g)].map(i => i[1]).pop(),
        mobile: [...html.matchAll(/user\.mobile.*= '(.*)'/g)].map(i => i[1]).pop()
      } as IUser;
      home.special = (() => {
        let list: IList = null;
        const sections = document.querySelectorAll('section.list-item.list-thumbplay');
        if (sections.length > 0) {
          list = this.getList(sections[0]);
        }
        return list;
      })() as IList;
    }
    return home;
  }

  tag(html: string, slug: string, index: boolean): ITag {
    const document = this.getDocument(html);
    const tag: ITag = {
      slug,
      next: this.nextLink(document)
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
}
