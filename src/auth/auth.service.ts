import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import {
  ILoginRequest,
  ILoginRequestPayload,
  ILoginVerify,
  ILoginVerifyPayload,
} from './auth.interface';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(private http: HttpService, private config: ConfigService) {}

  private getGuid(html: string | undefined): string {
    if (!html) throw new Error('');
    const guid = [...html.matchAll(/guid:"(.*)",additionalGet/g)].map(
      (i) => i[1],
    )[0];
    if (!guid) throw new Error('GUID not found');
    return guid;
  }

  private init(): Promise<{
    guid: string;
  }> {
    return this.http
      .get<string>(`${this.config.get('url.filimo')}/signin`, {
        responseType: 'text',
      })
      .pipe(
        map((response) => {
          const guid = this.getGuid(response.data);
          return {
            guid,
          };
        }),
      )
      .toPromise();
  }

  private getTempId(guid: string): Promise<string> {
    return this.http
      .post<any>(
        `${this.config.get('url.filimo')}/api/fa/v1/user/Authenticate/auth`,
        {
          guid,
        },
      )
      .pipe(
        map((response) => {
          return response.data?.data?.attributes?.temp_id;
        }),
      )
      .toPromise();
  }

  async request(payload: ILoginRequestPayload): Promise<ILoginRequest> {
    const init = await this.init();
    const tempId = await this.getTempId(init.guid);
    if (!tempId) throw new Error('temp_id not found');
    return this.http
      .post<any>(
        `${this.config.get(
          'url.filimo',
        )}/api/fa/v1/user/Authenticate/signin_step1`,
        {
          guid: init.guid,
          temp_id: tempId,
          codepass_type: payload.otp ? 'otp' : 'pass',
          account: payload.account,
        },
      )
      .pipe(
        map((response) => {
          return {
            guid: init.guid,
            tempId: response.data?.data?.attributes?.temp_id,
          } as ILoginRequest;
        }),
      )
      .toPromise();
  }

  async verify(payload: ILoginVerifyPayload): Promise<ILoginVerify> {
    let response: ILoginVerify;
    try {
      response = await this.http
        .post<any>(
          `${this.config.get(
            'url.filimo',
          )}/api/fa/v1/user/Authenticate/signin_step2`,
          {
            guid: payload.guid,
            temp_id: payload.tempId,
            account: payload.account,
            code: payload.code,
            codepass_type: payload.otp ? 'otp' : 'pass',
          },
        )
        .pipe(
          map((response) => {
            return {
              token: response.data?.data?.attributes?.token,
            } as ILoginVerify;
          }),
        )
        .toPromise();
    } catch (error) {
      console.log(error);
      response = await this.handleVerifyError(payload.guid, error);
    }
    return response;
  }

  async handleVerifyError(
    guid: string,
    error: AxiosError,
  ): Promise<ILoginVerify> {
    const statusCode = error.response.status;
    const errorBody = error.response.data;
    if (statusCode === 403 && errorBody?.errors?.length >= 1) {
      const maxDevices = errorBody.errors.find(
        (item) => item.type_info === 'get_max_tokens',
      );
      const forceOtp = errorBody.errors.find(
        (item) => item.type_info === 'force_mobile_signin',
      );
      if (maxDevices) {
        return this.logoutLastDeviceAndLogin(guid, errorBody.errors[0].uri);
      }
      if (forceOtp) {
        throw new Error('Try login with OTP');
      }
    }
    throw new Error('Auth verify failed');
  }

  async logoutLastDeviceAndLogin(
    guid: string,
    sessionsListUri: string,
  ): Promise<ILoginVerify> {
    const sessionRevokeUri = await this.getSessionRevokeUri(
      guid,
      sessionsListUri,
    );
    const loginUri = await this.getLoginUri(guid, sessionRevokeUri);
    return this.http
      .get<any>(`${this.config.get('url.filimo')}${loginUri}`, {
        params: {
          guid,
        },
      })
      .pipe(
        map((response) => {
          const token = response.data?.data?.attributes?.token;
          return {
            token,
          } as ILoginVerify;
        }),
      )
      .toPromise();
  }

  getSessionRevokeUri(guid: string, sessionsListUri: string): Promise<string> {
    return this.http
      .get<any>(`${this.config.get('url.filimo')}${sessionsListUri}`, {
        params: {
          guid,
        },
      })
      .pipe(
        map((response) => {
          const sessionsList = response.data?.data?.attributes?.data;
          let lastSessionKey = '';
          for (const key in sessionsList) {
            lastSessionKey = key;
          }
          return sessionsList[lastSessionKey].revoke_link;
        }),
      )
      .toPromise();
  }

  getLoginUri(guid: string, sessionRevokeUri: string): Promise<string> {
    return this.http
      .get<any>(`${this.config.get('url.filimo')}${sessionRevokeUri}`, {
        params: {
          guid,
        },
      })
      .pipe(
        map((response) => {
          return response.data?.data?.attributes?.uri;
        }),
      )
      .toPromise();
  }

  logout(): Promise<boolean> {
    return this.http
      .get<string>(
        `${this.config.get(
          'url.filimo',
        )}/authentication/authentication/signout`,
        {
          responseType: 'text',
        },
      )
      .pipe(map(() => true))
      .toPromise();
  }
}
