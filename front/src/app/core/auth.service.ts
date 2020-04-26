import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullscreenLoading } from '../shared/decorator/fullscreen-loading.decorator';
import { Observable } from 'rxjs';
import { IBaseResponse, ILoginRequestOtp, ILoginVerifyOtp } from '../app.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) {
  }

  @FullscreenLoading()
  requestOtp(mobile: string): Observable<IBaseResponse<ILoginRequestOtp>> {
    return this.http.post<IBaseResponse<ILoginRequestOtp>>(`${environment.baseUrl}/auth/otp/request`, {mobile});
  }

  @FullscreenLoading()
  verifyOtp(guid: string, tempId: string, mobile: string, otp: string): Observable<IBaseResponse<ILoginVerifyOtp>> {
    return this.http.post<IBaseResponse<ILoginVerifyOtp>>(`${environment.baseUrl}/auth/otp/verify`, {
      guid,
      tempId,
      mobile,
      otp
    });
  }

  @FullscreenLoading()
  logout(): Observable<IBaseResponse<null>> {
    return this.http.post<IBaseResponse<null>>(`${environment.baseUrl}/auth/logout`, {});
  }
}
