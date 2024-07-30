import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
goToHome() {
if(this.auth.getToken() && this.auth.isManager())
  this.router.navigateByUrl('/dashboard')
else  if(this.auth.getToken())
this.router.navigateByUrl('/attendance')
else
this.router.navigateByUrl('/signin')

}

  constructor(private auth: AuthenticationService, private router: Router, private cookie: CookieService) {
  }

  ngOnInit(): void {

  }

  isManager(): boolean {
    return this.auth.isManager();
  }


  checkLogin(): boolean {
    if (this.auth.getToken())
      return true
    return false;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/signin');
  }

  getCurrentUsername():string{
    return this.auth.getCurrentUserName();
  }
}
