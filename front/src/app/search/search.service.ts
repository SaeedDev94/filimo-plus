import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBaseResponse, ISearch } from '../app.interface';
import { environment } from '../../environments/environment';
import { AppData } from '../app.data';

@Injectable()
export class SearchService {

  constructor(
    private appData: AppData,
    private http: HttpClient
  ) {
  }

  query(keyword: string): Observable<IBaseResponse<ISearch[]>> {
    const path = this.appData.home.search + encodeURIComponent(keyword);
    return this.http.post<IBaseResponse<ISearch[]>>(`${environment.baseUrl}/search/index`, {path});
  }
}
