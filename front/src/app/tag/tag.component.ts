import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInfiniteScroll, ITag } from '../app.interface';
import { AppData } from '../app.data';
import { Log } from '../shared/helper/log.helper';
import { TagService } from './tag.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit, OnDestroy {

  constructor(
    private appData: AppData,
    private tagService: TagService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  tag: ITag;
  infiniteScroll: IInfiniteScroll;

  ngOnInit(): void {
    this.tag = this.activatedRoute.snapshot.data.tag;
    this.infiniteScroll = {
      disable: !this.tag.next,
      loading: false,
      callback: () => {
        this.tagService.next(this.tag.next).subscribe({
          next: (response) => {
            Log.i('TagService#next', response);
            if (response.success) {
              this.tag.list = this.tag.list.concat(response.data.list);
              this.tag.next = response.data.next;
              this.infiniteScroll.disable = !this.tag.next;
            }
          },
          error: (error) => {
            Log.e('TagService#next', error);
          },
          complete: () => {
            this.infiniteScroll.loading = false;
          }
        });
      }
    };
  }

  ngOnDestroy(): void {
    const index = this.appData.tag.findIndex(item => item.tag === this.tag.tag);
    if (index !== 1) {
      this.appData.tag[index] = this.tag;
    }
  }

}
