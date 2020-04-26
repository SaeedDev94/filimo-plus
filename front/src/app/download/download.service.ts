import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBaseResponse, IDownload } from '../app.interface';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class DownloadService {

  constructor(
    private http: HttpClient
  ) {
  }

  getList(): Promise<IBaseResponse<IDownload[]>> {
    return this.http.post<IBaseResponse<IDownload[]>>(`${environment.baseUrl}/download/list`, {}).toPromise();
  }

  cancelDownload(id: string): Observable<IBaseResponse<null>> {
    return this.http.post<IBaseResponse<null>>(`${environment.baseUrl}/download/cancel`, {id});
  }
}
