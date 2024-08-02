import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  constructor(private auth: AuthenticationService, private router: Router, private cookie: CookieService) {
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
