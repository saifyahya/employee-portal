import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/user-service/user.service';
import { Punch } from '../model/punch';
import { PunchService } from '../service/punch-service/punch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers:[]
})
export class HomeComponent implements OnInit, DoCheck{
searchEmployeeByName() {
this.userService.getUsersContaingName(this.searchedEmployee).subscribe((data=>{
  this.users=data;
  this.usersCount=this.users.length;
}))
}
searchedEmployee: any;

changeCollectedUsers() {
this.getUsersByDepartment()
// this.getUsersCountByDepartment()
}



 getUsersByDepartment(){
  if(this.selected_department==="All")
    this.getAllUsers();
  else
   this.userService.getUsersBYDepartment(this.selected_department).subscribe((data)=>{
  this.users=data
  this.usersCount=this.users.length;
   });
  
}

// getUsersCountByDepartment(){
//   if (this.selected_department==="All")
//   this.getUsersCount();
//   else
//   this.userService.getUsersCountByDepartment(this.selected_department).subscribe((data)=>this.usersCount=data)
// }

  ngDoCheck(): void {
   // console.log("home reinitializd");

  }
  users!:User[];
  usersCount:number=0;

  departments:string[]=["All","Software Development","QA","Mobile Development","BA","HR","IT","Product Development","Marketing"]
  selected_department: string=this.departments[0];

constructor(private userService:UserService, private punshservice:PunchService,private router:Router){
}

ngOnInit(): void {
 this.getUsersByDepartment();
//  this.getUsersCountByDepartment();

   // console.log("home reinitializd");
    
}

// getUsersCount():void{
//   this.userService.getAllUsersCount().subscribe((resposne )=>{this.usersCount=resposne;
//     console.log(resposne)
//   })
// }

getAllUsers():void{
  this.userService.getAllUsers().subscribe((resposne)=>{this.users=resposne;     this.usersCount=this.users.length;
  })
}

getUserPunchesSorted(user:User):  Punch[]{
  const sortedPunches:Punch[] = user.punches.sort((a, b) => {
    const dateA = new Date(a.punchDate + 'T' + a.punchTime);
    const dateB = new Date(b.punchDate + 'T' + b.punchTime);
    return dateA.getTime() - dateB.getTime();
  });
//  console.log(sortedPunches)

  return sortedPunches;
}

getFirstPunchTime(user:User): string[]{
  const lastPunch= this.getUserPunchesSorted(user)[this.getUserPunchesSorted(user).length-1]
  const sortedPunches= this.getUserPunchesSorted(user).filter((p)=>p.punchDate===lastPunch.punchDate);
  
     let firstTimePunch=''
   if(sortedPunches.length>0){
     firstTimePunch=sortedPunches[0]?.punchTime;
    let firstPuchDate=sortedPunches[0]?.punchDate;
   firstTimePunch= firstTimePunch.substring(0,firstTimePunch.length-3);
  return [firstPuchDate,this.formatPunchTime(firstTimePunch)];}
  return ["No Punches",""] 
}


formatPunchTime(time: string) {
  let timeArr = time.split(":");
  let hours = parseInt(timeArr[0]);
  let Morning_Evening = 'AM';
  if (parseInt(timeArr[0]) > 12) {
    hours = parseInt(timeArr[0]) - 12;
    Morning_Evening = "PM";
  }
  return hours + ":" + timeArr[1] + " " + Morning_Evening;
}

getlastPunchTime(user:User): string[]{
  const lastPunch= this.getUserPunchesSorted(user)[this.getUserPunchesSorted(user).length-1]
  const sortedPunchesByDATE= this.getUserPunchesSorted(user).filter((p)=>p.punchDate===lastPunch.punchDate);
  let lastTimePunch=''
  if(sortedPunchesByDATE.length>1){
    lastTimePunch=sortedPunchesByDATE[sortedPunchesByDATE.length-1]?.punchTime;
  let lastPunchDate=sortedPunchesByDATE[sortedPunchesByDATE.length-1]?.punchDate;
  lastTimePunch= lastTimePunch.substring(0,lastTimePunch.length-3);
 return [lastPunchDate,this.formatPunchTime(lastTimePunch)];}
 return   ["No Punches",""] ;

}

goToAttendanceOfEmployee(employeeName:string,employeeEmail: string){
  this.punshservice.currentUsername.next(employeeName);
  this.punshservice.UserEmailToAddPunchFromAdmin=employeeEmail;
  this.router.navigateByUrl("/attendance")
}

deleteUser(userEmail: string) {
  this.userService.deleteByEmail(userEmail).subscribe({
    next:(data)=>{alert("User deleted successfully")},
    error:(error)=>{alert("Failed to delete User")}
  }
  )
  }


mapDepartmentToEnums( departmentEnum:string):string{
  if(departmentEnum==="Mobile Development")
    return "MOBILE_DEVELOPMENT"
  if(departmentEnum==="Software Development")
    return "SOFTWARE_DEVELOPMENT"
  return departmentEnum
}


formatDepartmentEnums( departmentEnum:string):string{
  if(departmentEnum==="MOBILE_DEVELOPMENT")
    return "Mobile Development"
  if(departmentEnum==="SOFTWARE_DEVELOPMENT")
    return "Software Development"
  return departmentEnum
}

}


