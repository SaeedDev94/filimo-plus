import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Log } from '../../shared/helper/log.helper';
import { AppData } from '../../app.data';
import { IBaseResponse } from '../../app.interface';
import { IAuth } from '../core.interface';
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
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.stateService.loggedIn && this.appData.user) {
        resolve(true);
        return;
      }
      //
      this.httpClient.post<IBaseResponse<IAuth>>(`${environment.baseUrl}/home/index`, {}).subscribe({
        next: (response) => {
          if (response.success) {
            Log.i('AuthGuard#canActive', response);
            this.stateService.loggedIn = true;
            this.appData.user = response.data.user;
            this.appData.home = {
              search: response.data.search,
              special: response.data.special,
              items: response.data.items,
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
