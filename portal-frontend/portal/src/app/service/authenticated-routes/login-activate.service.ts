import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication-service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginActivateService implements CanActivate{
  isLoggedin = this.auth.getToken();

  constructor(private router:Router,private auth:AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    console.log(this.isLoggedin);
    
    if (this.auth.getToken()) {
      if(this.auth.isManager()){
      this.router.navigateByUrl("/dashboard");
      }
    else{
    this.router.navigateByUrl("/attendance")
      return false;}
    }
    return true;
  }



}