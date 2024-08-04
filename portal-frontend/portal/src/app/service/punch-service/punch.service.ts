import { HttpClient } from '@angular/common/http';
import { Inject, Injectable,  PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Punch } from '../../model/punch';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PunchService  {

  baseApi = "http://localhost:8080/api/v1/punches";
  UserEmailToAddPunchFromAdmin: string = '';
  currentUsername = new BehaviorSubject<string>(this.cookie.get('username'));
  currentUserNameStr = ''

  constructor(private http: HttpClient,private cookie:CookieService,  @Inject(PLATFORM_ID) private platformId: Object ) {
    console.log("punchservice initialized");
    this.currentUsername.subscribe((data) => { this.currentUserNameStr = data;
      console.log("current user name in the punch service is updated to ",data);
    })
    console.log("username pulled from cookie to punch service :", this.cookie.get('username'));
   }


  getUserPunchesByDatePeriodOrderedAsc(name: string, startDate: string, endDate: string): Observable<Punch[]> {
    const api = `${this.baseApi}/dates?name=${name}&sDate=${startDate}&eDate=${endDate}`;
    return this.http.get<Punch[]>(api).pipe(map((res) => {
      console.log("service api", res);
      return res;
    }))
  }

    /* Punch Method For Normal User */
  punchNow(type: string): Observable<any> {
    console.log("called on user ", this.currentUserNameStr);
    const api = `${this.baseApi}?type=${type}`;
    return this.http.post<any>(api, {}).pipe(map((res) => {
      console.log("service api", res);
      return res;
    }))
  }

  /* Punch Method For Admin */
  addNewPunch(punchDate: string, punchTime: string, type: string, userEmail: string): Observable<any> {
    console.log("called on user ", this.currentUserNameStr);
    const api = `${this.baseApi}/email?email=${userEmail}`;
    return this.http.post<any>(api, { punchDate: punchDate, punchTime: punchTime, type: type }).pipe(map((res) => {
      console.log("service api", res);
      return res;
    }))
  }

  /* Methods To get the User Last Punch BY date */
  getUserLastPunchByDateAndUsername(name: string, date: string): Observable<Punch> {
    const api = `${this.baseApi}/date/name?name=${name}&date=${date}`;
    return this.http.get<Punch>(api).pipe(map((res) => {
      console.log("service api", res);
      return res;
    }))
  }

  getUserLastPunchByDateAndUserEmail(email: string, date: string): Observable<Punch> {
    const api = `${this.baseApi}/date/email?email=${email}&date=${date}`;
    return this.http.get<Punch>(api).pipe(map((res) => {
      console.log("service api", res);
      return res;
    }))
  }

  getCurrentUserName():string{
    if (isPlatformBrowser(this.platformId)){
    return this.cookie.get('username')
    }
    return ""
  }

  deletePunch(email:string,date:string,time:string):Observable<{status:boolean, message:string}>{
    const api = `${this.baseApi}?email=${email}&date=${date}&time=${time}`;
    console.log(api);
    
    return this.http.delete<{status:boolean, message:string}>(api).pipe(map((res) => {
      console.log("service api", res);
      return res;
    }))
  }

}
