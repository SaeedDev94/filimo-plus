import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IBaseResponse, IDownloadRequest, IMovie } from '../app.interface';

@Injectable()
export class MovieService {

  constructor(
    private http: HttpClient
  ) {
  }

  getDetails(id: string): Observable<IBaseResponse<IMovie>> {
    return this.http.post<IBaseResponse<IMovie>>(`${environment.baseUrl}/movie/index`, {id});
  }

  requestDownload(download: IDownloadRequest): Observable<IBaseResponse<any>> {
    return this.http.post<IBaseResponse<any>>(`${environment.baseUrl}/download/request`, download);
  }
}
