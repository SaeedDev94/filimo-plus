import { Injectable } from '@angular/core';
import { StateService } from '../state.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    private stateService: StateService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    if (this.stateService.loggedIn) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
