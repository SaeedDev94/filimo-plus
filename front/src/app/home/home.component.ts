import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppData } from '../app.data';
import { IHome, IInfiniteScroll } from '../app.interface';
import { HomeService } from './home.service';
import { Log } from '../shared/helper/log.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private appData: AppData,
    private homeService: HomeService
  ) {
  }

  home: IHome;
  infiniteScroll: IInfiniteScroll;

  ngOnInit(): void {
    this.home = this.appData.home;
    this.infiniteScroll = {
      disable: !this.home.next,
      loading: false,
      callback: () => {
        this.homeService.next(this.home.next).subscribe({
          next: (response) => {
            Log.i('HomeService#next', response);
            if (response.success) {
              this.home.lists = this.home.lists.concat(response.data.lists);
              this.home.next = response.data.next;
              this.infiniteScroll.disable = !this.home.next;
            }
          },
          error: (error) => {
            Log.e('HomeService#next', error);
          },
          complete: () => {
            this.infiniteScroll.loading = false;
          }
        });
      }
    };
  }

  ngOnDestroy(): void {
    this.appData.home = this.home;
  }

}
