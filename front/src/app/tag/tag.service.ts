import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBaseResponse, ITag } from '../app.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class TagService {

  constructor(
    private http: HttpClient
  ) {
  }

  getList(tag: string): Observable<IBaseResponse<ITag>> {
    return this.http.post<IBaseResponse<ITag>>(`${environment.baseUrl}/tag/index`, {tag});
  }

  next(next: string): Observable<IBaseResponse<ITag>> {
    return this.http.post<IBaseResponse<ITag>>(`${environment.baseUrl}/tag/next`, {next});
  }
}
