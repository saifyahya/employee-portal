import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Punch } from '../../model/punch';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../authentication-service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PunchService implements OnInit{
  baseApi = "http://localhost:8080/api/v1/punches";
  UserEmailToAddPunchFromAdmin!: string;

  currentUsername=new Subject<string>();

  constructor(private http:HttpClient,private authService:AuthenticationService){}
  ngOnInit(): void {
    this.getCurrentUsername();
  }


getCurrentUsername(){
  this.currentUsername.next(this.authService.getCurrentUserName());
}


  // getUserPunches(name:string):Observable<Punch[]>{
  //   console.log("called on user ",this.currentUsername);
    
  //   const api=`${this.baseApi}?name=${name}`;
  //   return this.http.get<Punch[]>(api).pipe(map((res)=> {
  //     console.log("service api",res);
  //     return res; }))
  // }

  
  // getUserPunchesByDateOrderedAsc(name:string,date:string):Observable<Punch[]>{
  //   console.log("called on user ",this.currentUsername);
    
  //   const api=`${this.baseApi}/date?name=${name}&date=${date}`;
  //   return this.http.get<Punch[]>(api).pipe(map((res)=> {
  //     console.log("service api",res);
  //     return res; }))
  // }

getUsernameFromCookie(){
  
}

  getUserPunchesByDatePeriodOrderedAsc(name:string,startDate:string,endDate:string):Observable<Punch[]>{
    console.log("called on user ",this.currentUsername);
    
    const api=`${this.baseApi}/dates?name=${name}&sDate=${startDate}&eDate=${endDate}`;
    return this.http.get<Punch[]>(api).pipe(map((res)=> {
      console.log("service api",res);
      return res; }))
  }

  punchNow(type:string):Observable<any>{
    console.log("called on user ",this.currentUsername);
    const api=`${this.baseApi}?type=${type}`;
    return this.http.post<any>(api,{}).pipe(map((res)=> {
      console.log("service api",res);
      return res; }))
  }

  addNewPunch(punchDate:string,punchTime:string,type:string, userEmail:string):Observable<any>{
    console.log("called on user ",this.currentUsername);
    const api=`${this.baseApi}/email?email=${userEmail}`;
    return this.http.post<any>(api,{punchDte:punchDate,punchTime:punchTime,type:type}).pipe(map((res)=> {
      console.log("service api",res);
      return res; }))
  }
}
