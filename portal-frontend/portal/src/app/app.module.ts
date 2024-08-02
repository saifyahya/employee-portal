import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CalenderComponent } from './calender/calender.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { LoginComponent } from './login/login.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestInterceptorService } from './request-interceptor/http-request-interceptor.service';
import { CookieService } from 'ngx-cookie-service';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    CalenderComponent,
    AttendanceComponent,
    NewEmployeeComponent,
    LoginComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    NgbModule
  ],
  providers: [
    provideClientHydration(), 
    {provide:HTTP_INTERCEPTORS,useClass:HttpRequestInterceptorService,multi:true},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
