import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ILoginRequest, ILoginRequestPayload, ILoginVerify, ILoginVerifyPayload } from './auth.interface';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpService
  ) {
  }

  getGuid(): Promise<string> {
    return this.http.get<string>(`${process.env.filimoBaseUrl}/signin`, {
      responseType: 'text'
    }).pipe(
      map((response) => {
        const html = response.data || '';
        return [...html.matchAll(/guid: "(.*)"/g)].map(i => i[1])[0];
      })
    ).toPromise();
  }

  getTempId(guid: string): Promise<string> {
    return this.http.post<any>(`${process.env.filimoBaseUrl}/api/fa/v1/user/Authenticate/auth`, {
      guid
    }).pipe(
      map((response) => {
        return response.data?.data?.attributes?.temp_id;
      })
    ).toPromise();
  }

  async request(payload: ILoginRequestPayload): Promise<ILoginRequest> {
    const guid = await this.getGuid();
    if (!guid) throw new Error('AuthService#request: guid is not valid');
    const tempId = await this.getTempId(guid);
    if (!tempId) throw new Error('AuthService#request: tempId is not valid');
    return this.http.post<any>(`${process.env.filimoBaseUrl}/api/fa/v1/user/Authenticate/signin_step1`, {
      guid,
      'temp_id': tempId,
      'codepass_type': (payload.otp) ? 'otp' : 'pass',
      account: payload.account
    }).pipe(
      map((response) => {
        return {
          guid,
          tempId: response.data?.data?.attributes?.temp_id
        } as ILoginRequest;
      })
    ).toPromise();
  }

  async verify(payload: ILoginVerifyPayload): Promise<ILoginVerify> {
    let response: ILoginVerify;
    try {
      response = await this.http.post<any>(`${process.env.filimoBaseUrl}/api/fa/v1/user/Authenticate/signin_step2`, {
        guid: payload.guid,
        'temp_id': payload.tempId,
        account: payload.account,
        code: payload.code,
        'codepass_type': (payload.otp) ? 'otp' : 'pass'
      }).pipe(
        map((response) => {
          return {
            token: response.data?.data?.attributes?.token
          } as ILoginVerify;
        })
      ).toPromise();
    } catch (error) {
      console.log(error);
      response = await this.handleVerifyError(payload.guid, error);
    }
    return response;
  }

  async handleVerifyError(guid: string, error: AxiosError): Promise<ILoginVerify> {
    const statusCode = error.response.status || 0;
    const errorBody = error.response.data || {};
    const errors = errorBody.errors || [];
    const lastError = errors[errors.length - 1] || {};
    if (statusCode === 403 && errorBody.errors) {
      const maxDevices = errorBody.errors.find(item => item.type_info === 'get_max_tokens');
      const forceOtp = errorBody.errors.find(item => item.type_info === 'force_mobile_signin');
      if (maxDevices) {
        return this.logoutLastDeviceAndLogin(guid, errorBody.errors[0].uri);
      }
      if (forceOtp) {
        lastError.detail = 'ورود با رمز عبور امکان پذیر نیست، ورود با پیامک را امتحان کنید';
      }
      return null;
    }
  }

  async logoutLastDeviceAndLogin(guid: string, sessionsListUri: string): Promise<ILoginVerify> {
    const sessionRevokeUri = await this.getSessionRevokeUri(guid, sessionsListUri);
    const loginUri = await this.getLoginUri(guid, sessionRevokeUri);
    return this.http.get<any>(`${process.env.filimoBaseUrl}${loginUri}`, {
      params: {
        guid
      }
    }).pipe(
      map((response) => {
        const token = response.data?.data?.attributes?.token;
        return {
          token
        } as ILoginVerify;
      })
    ).toPromise();
  }

  getSessionRevokeUri(guid: string, sessionsListUri: string): Promise<string> {
    return this.http.get<any>(`${process.env.filimoBaseUrl}${sessionsListUri}`, {
      params: {
        guid
      }
    }).pipe(
      map((response) => {
        const sessionsList = response.data?.data?.attributes?.data;
        let lastSessionKey = '';
        for (const key in sessionsList) {
          lastSessionKey = key;
        }
        return sessionsList[lastSessionKey].revoke_link;
      })
    ).toPromise();
  }

  getLoginUri(guid: string, sessionRevokeUri: string): Promise<string> {
    return this.http.get<any>(`${process.env.filimoBaseUrl}${sessionRevokeUri}`, {
      params: {
        guid
      }
    }).pipe(
      map((response) => {
        return response.data?.data?.attributes?.uri;
      })
    ).toPromise();
  }

  logout(): Promise<boolean> {
    return this.http.get<string>(`${process.env.filimoBaseUrl}/authentication/authentication/signout`, {
      responseType: 'text'
    }).pipe(
      map(() => true)
    ).toPromise();
  }

}
