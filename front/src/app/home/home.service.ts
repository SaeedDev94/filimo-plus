import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IBaseResponse, IHome } from '../app.interface';

@Injectable()
export class HomeService {

  constructor(
    private http: HttpClient
  ) {
  }

  next(next: string): Observable<IBaseResponse<IHome>> {
    return this.http.post<IBaseResponse<IHome>>(`${environment.baseUrl}/home/next`, {next});
  }
}
