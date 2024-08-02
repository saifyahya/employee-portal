import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, MaybeAsync, GuardResult } from '@angular/router';
import { AuthenticationService } from '../authentication-service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ActivateRoutesService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.auth.getToken()) {
      return true;
    }
    else {
      this.router.navigateByUrl("/signin");
      return false;
    }
  }
}
