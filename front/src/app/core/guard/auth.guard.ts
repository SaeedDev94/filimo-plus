import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import { Log } from '../../shared/helper/log.helper';
import { AppData } from '../../app.data';
import { IBaseResponse, IHome, IUser } from '../../app.interface';
import { environment } from '../../../environments/environment';
import { StateService } from '../state.service';
import { FullscreenLoading } from '../../shared/decorator/fullscreen-loading.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private httpClient: HttpClient,
    private stateService: StateService,
    private appData: AppData,
    private router: Router
  ) {
  }

  @FullscreenLoading()
  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.stateService.loggedIn && this.appData.get<IUser>('user')) {
        resolve(true);
        return;
      }
      //
      this.httpClient.post<IBaseResponse<IHome>>(`${environment.baseUrl}/home/index`, {}).subscribe({
        next: (response) => {
          if (response.success) {
            Log.i('AuthGuard#canActive', response);
            this.stateService.loggedIn = true;
            this.appData.data.user = response.data.user;
            this.appData.data.home = {
              search: response.data.search,
              special: response.data.special,
              lists: response.data.lists,
              next: response.data.next
            };
            resolve(true);
            return;
          }
          this.failed(response, resolve);
        },
        error: (error) => {
          this.failed(error, resolve);
        }
      });
    });
  }

  failed(response: any, resolve: any) {
    Log.e('AuthGuard#canActive', response);
    localStorage.removeItem('jwt_token');
    this.stateService.loggedIn = false;
    resolve(false);
    this.router.navigate(['login']);
  }
}
