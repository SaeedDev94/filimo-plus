import { MDCDialog } from '@material/dialog';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IDownload } from '../app.interface';
import { DownloadService } from './download.service';
import { Log } from '../shared/helper/log.helper';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit, OnDestroy {

  constructor(
    private downloadService: DownloadService
  ) {
  }

  items: IDownload[] = [];
  selectedIndex = -1;
  baseUrl = environment.baseUrl;
  timeout: any;
  //
  dialog: any;
  @ViewChild('dialogElement', {static: true})
  set dialogElement(value: ElementRef) {
    this.dialog = new MDCDialog(value.nativeElement);
  }

  ngOnInit() {
    const getList = async () => {
      try {
        const response = await this.downloadService.getList();
        if (response.success) {
          response.data.forEach((download) => {
            const index = this.items.findIndex(item => item.id === download.id);
            if (index > -1) {
              this.items[index].progress = download.progress;
            } else {
              this.items.push(download);
            }
          });
        }
      } catch (error) {
        Log.e('DownloadService#getList', error);
      }
    };
    getList();
    this.timeout = setInterval(getList, 2000);
  }

  ngOnDestroy() {
    clearInterval(this.timeout);
  }

  openDialog(index: number) {
    this.selectedIndex = index;
    this.dialog.open();
  }

  closeDialog() {
    this.dialog.close();
  }

  cancelDownload() {
    this.closeDialog();
    const item = this.items[this.selectedIndex];
    item.deleted = true;
    this.downloadService.cancelDownload(item.id).subscribe({
      next: (response) => {
        Log.i('DownloadService#cancelDownload', response);
      },
      error: (error: any) => {
        Log.e('DownloadService#cancelDownload', error);
      }
    });
  }

}
