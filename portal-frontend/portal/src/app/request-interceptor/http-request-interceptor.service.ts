import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"

import { Observable } from "rxjs"
import { Injectable } from "@angular/core"
import { AuthenticationService } from "../service/authentication-service/authentication.service"


@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptorService implements HttpInterceptor{

  constructor(private auth: AuthenticationService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.auth.getToken()){
      // alert("interceptor works and sends the token")
      req=req.clone({
        setHeaders:{
          "Authorization":this.auth.getToken()+""
        }
      })
    }
    return next.handle(req)
  }
}
