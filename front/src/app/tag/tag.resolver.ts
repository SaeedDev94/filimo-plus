import { Injectable } from '@angular/core';
import { AppData } from '../app.data';
import { TagService } from './tag.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ITag } from '../app.interface';
import { FullscreenLoading } from '../shared/decorator/fullscreen-loading.decorator';
import { Log } from '../shared/helper/log.helper';

@Injectable()
export class TagResolver implements Resolve<ITag> {

  constructor(
    private appData: AppData,
    private tagService: TagService
  ) {
  }

  @FullscreenLoading()
  resolve(route: ActivatedRouteSnapshot): Promise<ITag> {
    const id = route.paramMap.get('id') || '';
    return new Promise<ITag>((resolve, reject) => {
      const tag: ITag = this.appData.get<ITag[]>('tag').find(item => item.slug === id);
      if (tag) {
        resolve(tag);
        return;
      }
      this.tagService.getList(id).subscribe({
        next: (response) => {
          Log.i('TagResolver#resolve', response);
          if (response.success) {
            this.appData.data.tag.push(response.data);
            resolve(response.data);
            return;
          }
          reject(new Error(response.message));
        },
        error: (error) => {
          reject(new Error(error));
        }
      });
    });
  }
}
