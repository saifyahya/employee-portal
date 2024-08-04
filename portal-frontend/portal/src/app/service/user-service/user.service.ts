import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../model/user';
import { log } from 'console';
import { UpdateEmployeeRequest } from '../../model/UpdateEmployeeRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{

 baseApi = "http://localhost:8080/api/v1/users";
  httpClient: any;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
      
  }

getAllUsersCount():Observable<number>{
  const api=`${this.baseApi}/count`;
  return this.http.get<{status:string, message:number}>(api).pipe(map((res)=> {
    console.log("service api",res.message);
    return res.message; }))
}

getUsersCountByDepartment(name:string):Observable<number>{
  const api=`${this.baseApi}/count/department?name=${name}`;
  return this.http.get<{status:string, message:number}>(api).pipe(map((res)=> {
    console.log("service api",res.message);
    return res.message; }))
}

getAllUsers():Observable<User[]>{
  const api = this.baseApi;
  return this.http.get<User[]>(api).pipe(map((res)=> {return res}))
}

getUsersBYDepartment(name:string):Observable<User[]>{
  const api = `${this.baseApi}/department?name=${name}`;
  return this.http.get<User[]>(api).pipe(map((res)=> {return res}))
}
getUsersContaingName(name:string):Observable<User[]>{
  const api = `${this.baseApi}/name?name=${name}`;
  return this.http.get<User[]>(api).pipe(map((res)=> {return res}))
}

deleteByEmail(userEmail: string):Observable<string> {
  const api=`${this.baseApi}?email=${userEmail}`;
  return this.http.delete<{status:string, message:string}>(api).pipe(map((res)=> {
    console.log("service api",res.message);
    return res.message; }))  }

    getAllUserNames():Observable<string[]>{
      const api=`${this.baseApi}/fullName`;
      return this.http.get<string[]>(api).pipe(map((res)=> {return res}))
    }
    getAllUserEmails():Observable<string[]>{
      const api=`${this.baseApi}/fullEmail`;
      return this.http.get<string[]>(api).pipe(map((res)=> {return res}))
    }

    updateUser(userOriginalEmail: string, updatedUser:UpdateEmployeeRequest):Observable<{status:boolean, message:string}>{
      return this.http.put<{status:boolean, message:string}>(`${this.baseApi}?email=${userOriginalEmail}`, updatedUser).pipe(map((res) => { return res; }));
      
    }

}
