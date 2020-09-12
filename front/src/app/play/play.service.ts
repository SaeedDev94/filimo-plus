import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBaseResponse, IPlay } from '../app.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class PlayService {

  constructor(
    private http: HttpClient
  ) {
  }

  hls(body: any): Promise<IBaseResponse<IPlay>> {
    return this.http.post<IBaseResponse<IPlay>>(`${environment.baseUrl}/play/hls`, body, {
      params: {
        timestamp: String(new Date().valueOf())
      }
    }).toPromise();
  }

  file(id: string): Promise<IBaseResponse<IPlay>> {
    return this.http.post<IBaseResponse<IPlay>>(`${environment.baseUrl}/play/file`, {id}).toPromise();
  }
}
