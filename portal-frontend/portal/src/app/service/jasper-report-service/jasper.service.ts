import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JasperService {

  baseApi = "http://localhost:8080/api/v1/report";
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
      
  }

getUserReport(username:string,startDate:string,endDate:string):Observable<Blob>{
  const api=`${this.baseApi}?username=${username}&startDate=${startDate}&endDate=${endDate}`;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.get(api, { headers, responseType: 'blob' });
}

}
