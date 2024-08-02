import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { AddEmployeeRequest } from '../../model/addEmployeeRequest';
import { PunchService } from '../punch-service/punch.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService{

  isManager(): boolean {
    const role = this.cookie.get('role'); 
  
    if (role) {
      let arrayRole: string[] = JSON.parse(role);
      for (const r of arrayRole) {
        if (r === 'manager') {
          return true;
        }
      }
    }
    return false; 
  }

  baseUrl: string = "http://localhost:8080/api/v1/auth/";
  domain: string = ''; 

  constructor(
    private httpClient: HttpClient,
    private cookie: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,private punchService:PunchService ) {

    if (isPlatformBrowser(this.platformId)) {
      this.domain = window.location.hostname;
    }
  }

  loginResponseDto!: { token: string };

  login(email: string, password: string) {
    return this.httpClient.post<{ token: string; username: string; role: string[] }>(`${this.baseUrl}login`, { email, password })
      .pipe(
        map((res) => {
          const token = res.token.toString();
          const username = res.username.toString();
          const role: string[] = res.role;
          if (isPlatformBrowser(this.platformId)){
          this.cookie.set("token", `Bearer ${token}`, 1, '/', this.domain);
          this.cookie.set("username", username, 1, '/', this.domain);
          this.cookie.set("role", JSON.stringify(role), 1, '/', this.domain);
          this.punchService.currentUsername.next(username);
          }
          return token;
        }),
      );
  }
  

  signup(request:AddEmployeeRequest) {
    return this.httpClient.post<any>(`${this.baseUrl}addUser`, request).pipe(map((res) => { return res; }));
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)){
    if (this.cookie.get("token")) {
      return this.cookie.get("token");
    }
  }
  return null;
  }

  logout() {
    this.cookie.delete("token", '/', this.domain);
    this.cookie.delete("role", '/', this.domain);
    this.cookie.delete("username", '/', this.domain);

  }

  getCurrentUserName():string{
    if (isPlatformBrowser(this.platformId)){
    return this.cookie.get('username')
    }
    return ""
  }

}
