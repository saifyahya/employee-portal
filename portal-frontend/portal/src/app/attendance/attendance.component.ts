import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PunchService } from '../service/punch-service/punch.service';
import { Punch } from '../model/punch';
import { AuthenticationService } from '../service/authentication-service/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
  providers: []
})
export class AttendanceComponent implements OnInit {
toggoleTimePicker(event: MouseEvent) {
event.preventDefault();
this.viewTimePicker=!this.viewTimePicker;
}
date = new Date();
pickedPunchDate: {year:number , month: number, day:number}={year:this.date.getFullYear(),month:this.date.getMonth()+1,day:this.date.getDate()};
pickedPunchTime: {hour:number, minute:number}={hour:this.date.getHours(), minute:this.date.getMinutes()};

viewTimePicker: boolean=false;
toggoleDatePicker(event: MouseEvent) {
event.preventDefault;
this.viewDatePicker=!this.viewDatePicker;
}
viewMyPunches() {
this.punchService.currentUsername.next(this.authService.getCurrentUserName());
this.punchService.UserEmailToAddPunchFromAdmin='';
}
  @ViewChild('punchModal', { static: true }) punchModal!: TemplateRef<any>;

  constructor(private punchService: PunchService,private authService:AuthenticationService,private modalService: NgbModal) {
  }
  openPunchModal() {
    this.modalService.open(this.punchModal);
  }

punchType: string="office";
myDateValue: Date = new Date();
myTime: Date = new Date();
isMeridian: boolean = true;
punchNow() {
  console.log(this.punchType);
  

}
addPunch() {
  const type= this.punchType;
  const formattedMonth =this.pickedPunchDate.month.toString().length===1?'0'+this.pickedPunchDate.month.toString():this.pickedPunchDate.month.toString();
  const formattedDay =this.pickedPunchDate.day.toString().length===1?'0'+this.pickedPunchDate.day.toString():this.pickedPunchDate.day.toString();
  const punchDate=this.pickedPunchDate.year+'-'+formattedMonth+'-'+formattedDay;
  
  const formattedHour =this.pickedPunchTime.hour.toString().length===1?'0'+this.pickedPunchTime.hour.toString():this.pickedPunchTime.hour.toString();
  const formattedMinutes =this.pickedPunchTime.minute.toString().length===1?'0'+this.pickedPunchTime.minute.toString():this.pickedPunchTime.minute.toString();
  const punchTime=formattedHour+':'+formattedMinutes;
  const userEmail = this.getUserEmailToAddPunchByAdmin();
  console.log(punchDate," ",punchTime," ", userEmail, " ",punchTime, " ", type);
  if(this.punchService.UserEmailToAddPunchFromAdmin){
    this.punchService.addNewPunch(punchDate,punchTime,type,userEmail).subscribe({
      next:(data)=>{console.log(data);
      },
      error:(error)=>{console.log(error);
      }
    });
  }
  else{
this.punchService.punchNow(this.punchType).subscribe({
  next:(data)=>{console.log(data);
  },
  error:(error)=>{console.log(error);
  }
});
  }


}

viewDatePicker= false;



getUserEmailToAddPunchByAdmin():string{
  if (this.punchService.UserEmailToAddPunchFromAdmin)
    return this.punchService.UserEmailToAddPunchFromAdmin;
  return this.currentUsername;
}

ngAfterViewInit(): void {
}


  isPunchInThisDay(punch: Punch, date: Date): boolean {

    const newDate = new Date(punch.punchDate);

    return newDate.getFullYear() === date.getFullYear()
      && newDate.getMonth() === date.getMonth()
      && newDate.getDate() === date.getDate();
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

  //users!:User[];
  currentUsername = '';
  punches!: Punch[];

  firstDayofThisWeek!: Date;
  weeks: Date[] = [];
  workingHours: Map<string, number[]> = new Map<string, number[]>();
  BreakingHours: Map<string, number[]> = new Map<string, number[]>();
  punchesMap: Map<string, string[]> = new Map<string, string[]>();

  workReminder : Map<string, string> = new Map<string, string>();
  breakReminder : Map<string, string> = new Map<string, string>();




  async getUserPunches() {
    const startDate = this.weeks[0].toISOString().split("T")[0];
    const endDate = this.weeks[this.weeks.length - 1].toISOString().split("T")[0];
  //  let currentUsername='';
//this.punchService.currentUsername.subscribe((data)=>currentUsername=data);
    try {
      const data = await this.punchService.getUserPunchesByDatePeriodOrderedAsc(
        this.currentUsername,
        startDate,
        endDate
      ).toPromise();
      this.punches = data || [];
      await this.mapPunchesToDates(this.punches);
      await this.calculateWorking_BreakingHours(this.punches);
    } catch (error) {
      console.error("Error fetching punches:", error);
    }
  }

  async mapPunchesToDates(data: Punch[] | undefined) {
    if (data) {
      data.forEach((p) => {
        if (this.punchesMap.has(p.punchDate))
          this.punchesMap.get(p.punchDate)?.push(p.punchTime);
        else
          this.punchesMap.set(p.punchDate, [p.punchTime]);
      })
    }
    console.log("user punches",this.punches);
    
  }

  // async calculateWorking_BreakingHours(punches: Punch[]) {
  //   for (const day of this.weeks) {
  //     let dayDate = day.toISOString().split('T')[0];
  //     let dayPunches = punches.filter((p) => p.punchDate === dayDate)

  //     let workHours: number[] = [0, 0];
  //     let breakHours: number[] = [0, 0];
  //     for (let i = 0; i < dayPunches.length; i++) {
  //       if (i % 2 === 0) {

  //         if (punches[i + 1]) {
  //           workHours[0] += this.differentBetweenTwoTimes(punches[i].punchTime, punches[i + 1].punchTime)[0]
  //           workHours[1] += this.differentBetweenTwoTimes(punches[i].punchTime, punches[i + 1].punchTime)[1]

  //         } else {   // the empoloyee does not punch checkout for his working period 
  //           // let date = new Date();
  //           // let currentTime= date.getHours()+':'+date.getMinutes();
  //           // workHours[0]+=this.differentBetweenTwoTimes(punches[i].punchTime,currentTime)[0]
  //           // workHours[1]+=this.differentBetweenTwoTimes(punches[i].punchTime,currentTime)[1]
  //           this.workReminder = `You have been working from ${punches[i]}`

  //         }
  //       }
  //       else {
  //         if (punches[i + 1]) {
  //           breakHours[0] += this.differentBetweenTwoTimes(punches[i].punchTime, punches[i + 1].punchTime)[0]
  //           breakHours[1] += this.differentBetweenTwoTimes(punches[i].punchTime, punches[i + 1].punchTime)[1]
  //         }
  //         else { // the empoloyee does not punch checkout for his breaking period 
  //           // let date = new Date();
  //           // let currentTime= date.getHours()+':'+date.getMinutes();
  //           // breakHours[0]+=this.differentBetweenTwoTimes(punches[i].punchTime,currentTime)[0]
  //           // breakHours[1]+=this.differentBetweenTwoTimes(punches[i].punchTime,currentTime)[1]
  //           this.breakReminder = `You have been taking a break from ${punches[i]}`

  //         }
  //       }
  //     }
  //     let totalWM = workHours[0] * 60 + workHours[1];
  //     let totalWH = Math.floor(totalWM / 60);
  //     totalWM = totalWM % 60;

  //     let totalBM = breakHours[0] * 60 + breakHours[1];
  //     let totalBH = Math.floor(totalBM / 60);
  //     totalBM = totalBM % 60;

  //     this.workingHours.set(dayDate, [totalWH, totalWM])
  //     this.BreakingHours.set(dayDate, [totalBH, totalBM])
  //   }
  // }
  async calculateWorking_BreakingHours(punches: Punch[]) {
    for (const day of this.weeks) {
        let dayDate = day.toISOString().split('T')[0];
        let dayPunches = punches.filter((p) => p.punchDate === dayDate);

        let workHours: number[] = [0, 0];
        let breakHours: number[] = [0, 0];

        for (let i = 0; i < dayPunches.length; i++) {
            if (i % 2 === 0) { // Check-ins (start of a working period)
                if (dayPunches[i + 1]) {
                    let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, dayPunches[i + 1].punchTime);
                    workHours[0] += diff[0];
                    workHours[1] += diff[1];
                } else {
                    // Employee did not punch checkout for their working period
                    let currentDate = new Date();
                    let currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();
                    if (currentDate.toISOString().split('T')[0] === dayPunches[i].punchDate) {
                        let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, currentTime);
                        workHours[0] += diff[0];
                        workHours[1] += diff[1];
                        console.log("reminder for work setted at",dayPunches[i].punchDate )
                        this.workReminder.set(dayPunches[i].punchDate, `You have been working from ${this.formatPunchTime(dayPunches[i].punchTime)}`);
                    }
                }
            } else { // Check-outs (start of a break period)
                if (dayPunches[i + 1]) {
                    let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, dayPunches[i + 1].punchTime);
                    breakHours[0] += diff[0];
                    breakHours[1] += diff[1];
                } else {
                    // Employee did not punch checkout for their break period
                    let currentDate = new Date();
                    let currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();
                    if (currentDate.toISOString().split('T')[0] === dayPunches[i].punchDate) {
                        let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, currentTime);
                        breakHours[0] += diff[0];
                        breakHours[1] += diff[1];
                        console.log("reminder for break setted at",dayPunches[i].punchDate )
                        this.breakReminder.set(dayPunches[i].punchDate, `You have been taking a break from ${this.formatPunchTime(dayPunches[i].punchTime)}`);
                    }
                }
            }
        }

        // Sum total hours correctly and set into the Maps
        let totalWM = workHours[0] * 60 + workHours[1];
        let totalWH = Math.floor(totalWM / 60);
        let totalWMRest = totalWM % 60;

        let totalBM = breakHours[0] * 60 + breakHours[1];
        let totalBH = Math.floor(totalBM / 60);
        let totalBMRest = totalBM % 60;

        this.workingHours.set(dayDate, [totalWH, totalWMRest]);
        this.BreakingHours.set(dayDate, [totalBH, totalBMRest]);
    }
}



  differentBetweenTwoTimes(start: string, end: string): number[] {
    const startHours = parseInt(start.substring(0, 2));
    const startMinutes = parseInt(start.substring(3, 5));
    const endHours = parseInt(end.substring(0, 2));
    const endMinutes = parseInt(end.substring(3, 5));

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    let difference = endTotalMinutes - startTotalMinutes;

    // Handle cases where the difference is negative (crossing midnight)
    if (difference < 0) {
      difference += 24 * 60; // Add 24 hours worth of minutes
    }

    // Convert the difference back to hours and minutes
    const diffHours = Math.floor(difference / 60);
    const diffMinutes = difference % 60;
    return [diffHours, diffMinutes]
  }

  ngOnInit(){
    this.getTheFirstDayOfTheWeek();
    this.fillWeeks();
    this.punchService.currentUsername.subscribe((data)=>{this.currentUsername=data;
      this.getUserPunches()
    });
  }

  getTheFirstDayOfTheWeek(): void {
    let d = new Date();
    let day = d.getDay();
    d.setDate(d.getDate() - day);
    this.firstDayofThisWeek = new Date(d);
  }

  fillWeeks(): void {
    this.weeks.push(new Date(this.firstDayofThisWeek));
    for (let i = 0; i < 6; i++) {
      let nextDate = this.firstDayofThisWeek.getDate() + 1;
      this.firstDayofThisWeek.setDate(nextDate);
      this.weeks.push(new Date(this.firstDayofThisWeek));
    }
  }
  nextWeek(): void {
    this.weeks.forEach((d) => d.setDate(d.getDate() + 7))
    this.getUserPunches()

  }
  prevWeek(): void {
    this.weeks.forEach((d) => d.setDate(d.getDate() - 7))
    this.getUserPunches()

  }



  getWorkReminders() :string|undefined {
    const currentDate = new Date().toISOString().split("T")[0];
    return this.workReminder.get(currentDate+'')
  }

  getBreakReminders(): string|undefined {
    const currentDate = new Date().toISOString().split("T")[0];
    return this.breakReminder.get(currentDate+'')  }



    isManager():Boolean{
      return this.authService.isManager();
    }
}



