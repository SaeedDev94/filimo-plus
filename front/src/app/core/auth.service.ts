import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullscreenLoading } from '../shared/decorator/fullscreen-loading.decorator';
import { Observable } from 'rxjs';
import { IBaseResponse, ILoginRequest, ILoginVerify } from '../app.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) {
  }

  @FullscreenLoading()
  request(mobile: string, otp: boolean): Observable<IBaseResponse<ILoginRequest>> {
    return this.http.post<IBaseResponse<ILoginRequest>>(`${environment.baseUrl}/auth/step/one`, {
      mobile,
      otp
    });
  }

  @FullscreenLoading()
  verify(guid: string, tempId: string, mobile: string, pass: string, otp: boolean): Observable<IBaseResponse<ILoginVerify>> {
    return this.http.post<IBaseResponse<ILoginVerify>>(`${environment.baseUrl}/auth/step/two`, {
      guid,
      tempId,
      mobile,
      pass,
      otp
    });
  }

  @FullscreenLoading()
  logout(): Observable<IBaseResponse<null>> {
    return this.http.post<IBaseResponse<null>>(`${environment.baseUrl}/auth/logout`, {});
  }
}
