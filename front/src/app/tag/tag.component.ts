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
    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.tag = data.tag;
        document.querySelector('.body').scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
    this.infiniteScroll = {
      disable: !this.tag.next,
      loading: false,
      callback: () => {
        this.tagService.next(this.tag.next).subscribe({
          next: (response) => {
            Log.i('TagService#next', response);
            if (response.success) {
              if (this.tag.multiSection) {
                this.tag.lists = this.tag.lists.concat(response.data.lists);
              } else {
                this.tag.lists[0].items = this.tag.lists[0].items.concat(response.data.listItems);
              }
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
    const index = this.appData.tag.findIndex(item => item.slug === this.tag.slug);
    if (index !== 1) {
      this.appData.tag[index] = this.tag;
    }
  }

}
