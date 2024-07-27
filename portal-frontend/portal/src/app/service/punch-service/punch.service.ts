import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Punch } from '../../model/punch';

@Injectable({
  providedIn: 'root'
})
export class PunchService {
  baseApi = "http://localhost:8080/api/v1/punches";

  constructor(private http:HttpClient) { }

  currentUsername='';

  getUserPunches(name:string):Observable<Punch[]>{
    console.log("called on user ",this.currentUsername);
    
    const api=`${this.baseApi}?name=${name}`;
    return this.http.get<Punch[]>(api).pipe(map((res)=> {
      console.log("service api",res);
      return res; }))
  }

  
  getUserPunchesByDateOrderedAsc(name:string,date:string):Observable<Punch[]>{
    console.log("called on user ",this.currentUsername);
    
    const api=`${this.baseApi}/date?name=${name}&date=${date}`;
    return this.http.get<Punch[]>(api).pipe(map((res)=> {
      console.log("service api",res);
      return res; }))
  }

  getUserPunchesByDatePeriodOrderedAsc(name:string,startDate:string,endDate:string):Observable<Punch[]>{
    console.log("called on user ",this.currentUsername);
    
    const api=`${this.baseApi}/dates?name=${name}&sDate=${startDate}&eDate=${endDate}`;
    return this.http.get<Punch[]>(api).pipe(map((res)=> {
      console.log("service api",res);
      return res; }))
  }


}
