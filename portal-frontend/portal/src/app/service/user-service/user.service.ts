import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../model/user';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{
 baseApi = "http://localhost:8080/api/v1/users";
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
      
  }

getAllUsersCount():Observable<number>{
  const api=`${this.baseApi}/count`;
  return this.http.get<{status:string, message:number}>(api).pipe(map((res)=> {
    console.log("service api",res.message);
    
    return res.message; }))
}


getAllUsers():Observable<User[]>{
  const api = this.baseApi;
  return this.http.get<User[]>(api).pipe(map((res)=> {return res}))
}

}
