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

changeCollectedUsers() {
this.getAllUsers();
this.getUsersByDepartment()
}



 getUsersByDepartment(){
  if(this.selected_department==="All")
    this.getAllUsers();
  else
   this.userService.getUsersBYDepartment(this.mapDepartmentToEnums(this.selected_department)).subscribe((data)=>{this.users=data

   });
  
}

getUsersCountByDepartment(){
  if (this.selected_department==="All")
  this.getUsersCount();
  else
  this.userService.getUsersCountByDepartment(this.mapDepartmentToEnums(this.selected_department))
}

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
  this.getAllUsers();
  this.getUsersByDepartment()

   // console.log("home reinitializd");
    
}

getUsersCount():void{
  this.userService.getAllUsersCount().subscribe((resposne )=>{this.usersCount=resposne;
    console.log(resposne)
  })
}

getAllUsers():void{
  this.userService.getAllUsers().subscribe((resposne)=>{this.users=resposne;     console.log(resposne)
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

getFirstPunchTime(user:User): string{
  const lastPunch= this.getUserPunchesSorted(user)[this.getUserPunchesSorted(user).length-1]
  const sortedPunches= this.getUserPunchesSorted(user).filter((p)=>p.punchDate===lastPunch.punchDate);
     let firstTimePunch=''
   if(sortedPunches.length>0)
     firstTimePunch=sortedPunches[0].punchTime;
   firstTimePunch= firstTimePunch.substring(0,firstTimePunch.length-3);
  return firstTimePunch;
}

getlastPunchTime(user:User): string{
  const lastPunch= this.getUserPunchesSorted(user)[this.getUserPunchesSorted(user).length-1]
  const sortedPunchesByDATE= this.getUserPunchesSorted(user).filter((p)=>p.punchDate===lastPunch.punchDate);
  let lastTimePunch=''
  if(sortedPunchesByDATE.length>1)
    lastTimePunch=sortedPunchesByDATE[sortedPunchesByDATE.length-1].punchTime;
  lastTimePunch= lastTimePunch.substring(0,lastTimePunch.length-3);
 return lastTimePunch;
}

goToAttendanceOfEmployee(employeeName: string){
  this.punshservice.currentUsername=employeeName;
  this.router.navigateByUrl("/punches")
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


