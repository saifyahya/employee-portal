import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication-service/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class ActivateRoutesService implements CanActivate{

  constructor(private auth:AuthenticationService,private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
if(this.auth.getToken()){
  return true;
}
this.router.navigateByUrl("/signin");
return false;
  }
}

