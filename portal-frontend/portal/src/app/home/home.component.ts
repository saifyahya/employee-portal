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

  ngDoCheck(): void {
   // console.log("home reinitializd");

  }
  users!:User[];
  usersCount:number=0;

constructor(private userService:UserService, private punshservice:PunchService,private router:Router){
}

ngOnInit(): void {
    this.getAllUsers();
    this.getUsersCount();

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

getUserPunches(user:User):  Punch[]{
  const sortedPunches:Punch[] = user.punches.sort((a, b) => {
    const dateA = new Date(a.punchDate + 'T' + a.punchTime);
    const dateB = new Date(b.punchDate + 'T' + b.punchTime);
    return dateA.getTime() - dateB.getTime();
  });
//  console.log(sortedPunches)

  return sortedPunches;
}

getFirstPunchTime(user:User): string{
  const lastPunch= this.getUserPunches(user)[this.getUserPunches(user).length-1]
  const sortedPunches= this.getUserPunches(user).filter((p)=>p.punchDate===lastPunch.punchDate);
     let firstTimePunch=''
   if(sortedPunches.length>0)
     firstTimePunch=sortedPunches[0].punchTime;
   firstTimePunch= firstTimePunch.substring(0,firstTimePunch.length-3);
  return firstTimePunch;
}

getlastPunchTime(user:User): string{
  const lastPunch= this.getUserPunches(user)[this.getUserPunches(user).length-1]
  const sortedPunches= this.getUserPunches(user).filter((p)=>p.punchDate===lastPunch.punchDate);
  let lastTimePunch=''

  if(sortedPunches.length>1)
    lastTimePunch=sortedPunches[sortedPunches.length-1].punchTime;
  lastTimePunch= lastTimePunch.substring(0,lastTimePunch.length-3);
 return lastTimePunch;
}

goToAttendanceOfEmployee(employeeName: string){
  this.punshservice.currentUsername=employeeName;
  this.router.navigateByUrl("/punches")
}

}


