import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { LoginComponent } from './login/login.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { LoginActivateService } from './service/authenticated-routes/login-activate.service';
import { ActivateRoutesService } from './service/authenticated-routes/activate-routes.service';

const routes: Routes = [
  {path:'dashboard',component:HomeComponent,canActivate:[ActivateRoutesService]},
  {path:'attendance',component:AttendanceComponent,canActivate:[ActivateRoutesService]},
  { path: 'signin', component: LoginComponent ,canActivate:[LoginActivateService]},
  { path: 'addEmpolyee', component: NewEmployeeComponent ,canActivate:[ActivateRoutesService]},
  {path:'**',component:LoginComponent,canActivate:[LoginActivateService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
