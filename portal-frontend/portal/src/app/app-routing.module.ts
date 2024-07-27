import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'punches',component:AttendanceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
