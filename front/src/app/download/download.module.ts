import { NgModule } from '@angular/core';
import { DownloadRoutingModule } from './download-routing.module';
import { DownloadComponent } from './download.component';
import { SharedModule } from '../shared/shared.module';
import { DownloadService } from './download.service';

@NgModule({
  declarations: [DownloadComponent],
  imports: [
    SharedModule,
    DownloadRoutingModule
  ],
  providers: [
    DownloadService
  ]
})
export class DownloadModule {}
