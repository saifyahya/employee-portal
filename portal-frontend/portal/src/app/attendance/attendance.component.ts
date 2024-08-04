import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PunchService } from '../service/punch-service/punch.service';
import { Punch } from '../model/punch';
import { AuthenticationService } from '../service/authentication-service/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JasperService } from '../service/jasper-report-service/jasper.service';
import { UserService } from '../service/user-service/user.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
  providers: []
})
export class AttendanceComponent implements OnInit, OnDestroy {



  /*  User Punches, Weeks Array, User working/Breaking hours */
  currentUsername = '';
  punches!: Punch[];
  firstDayofThisWeek!: Date;
  weeks: Date[] = [];
  workingHours: Map<string, number[]> = new Map<string, number[]>();
  BreakingHours: Map<string, number[]> = new Map<string, number[]>();
  workReminder: Map<string, string> = new Map<string, string>();
  breakReminder: Map<string, string> = new Map<string, string>();
  lastPunchTimeMessage: string = '';

  /* Adding Punch Modal, Picked Date/Time/PunchType */
  date = new Date();
  pickedPunchDate: { year: number, month: number, day: number } = { year: this.date.getFullYear(), month: this.date.getMonth() + 1, day: this.date.getDate() };
  pickedPunchTime: { hour: number, minute: number } = { hour: this.date.getHours(), minute: this.date.getMinutes() };
  viewDatePicker = false;
  viewTimePicker: boolean = false;
  @ViewChild('punchModal', { static: true }) punchModal!: TemplateRef<any>;
  punchType: string = "office";
  punchAddedSuccessfully: boolean = false;
  punchNotAdded: boolean = false;
  @ViewChild('deletePunchModal', { static: true }) deletePunchModal!: TemplateRef<any>;
  punchToDelete!: Punch;
  constructor(private punchService: PunchService, private authService: AuthenticationService,
    private modalService: NgbModal, private jasperService: JasperService, private userService: UserService) { }

  ngOnInit() {
    this.getTheFirstDayOfTheWeek();
    this.fillWeeks();
    this.punchService.currentUsername.subscribe((data) => {
      console.log("username pulled from punch serviceto atted: " + data);
      this.currentUsername = data;
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

  /* Get the current User Punches */
  async getUserPunches() {
    const startDate = this.weeks[0].toISOString().split("T")[0];
    const endDate = this.weeks[this.weeks.length - 1].toISOString().split("T")[0];

    try {
      const data = await this.punchService.getUserPunchesByDatePeriodOrderedAsc(
        this.currentUsername,
        startDate,
        endDate
      ).toPromise();
      this.punches = data || [];
      await this.calculateWorking_BreakingHours(this.punches);
    } catch (error) {
      console.error("Error fetching punches:", error);
    }
  }


  /* Calculate Work/Break hours based on the punches[]*/
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
          } else {              // Employee did not punch checkout for their working period
            let currentDate = new Date();
            let currentHours = (currentDate.getHours() + '').length === 1 ? '0' + currentDate.getHours() : currentDate.getHours() + '';
            let currentMinutes = (currentDate.getMinutes() + '').length === 1 ? '0' + currentDate.getMinutes() : currentDate.getMinutes() + ''
            let currentTime = currentHours + ':' + currentMinutes;
            if (currentDate.toISOString().split('T')[0] === dayPunches[i].punchDate) {
              let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, currentTime);
              workHours[0] += diff[0];
              workHours[1] += diff[1];
              console.log("reminder for work setted at", dayPunches[i].punchDate)
              this.breakReminder.delete(dayPunches[i].punchDate);
              this.workReminder.set(dayPunches[i].punchDate, `You have been working from ${this.formatPunchTime(dayPunches[i].punchTime)}`);
            }
          }
        } else { // Check-outs (start of a break period)
          if (dayPunches[i + 1]) {
            let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, dayPunches[i + 1].punchTime);
            breakHours[0] += diff[0];
            breakHours[1] += diff[1];
          } else {             // Employee did not punch checkout for their break period
            let currentDate = new Date();
            let currentHours = (currentDate.getHours() + '').length === 1 ? '0' + currentDate.getHours() : currentDate.getHours() + '';
            let currentMinutes = (currentDate.getMinutes() + '').length === 1 ? '0' + currentDate.getMinutes() : currentDate.getMinutes() + ''
            let currentTime = currentHours + ':' + currentMinutes;
            if (currentDate.toISOString().split('T')[0] === dayPunches[i].punchDate) {
              let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, currentTime);
              breakHours[0] += diff[0];
              breakHours[1] += diff[1];
              console.log("reminder for break setted at", dayPunches[i].punchDate)
              this.workReminder.delete(dayPunches[i].punchDate);
              this.breakReminder.set(dayPunches[i].punchDate, `You have been taking a break from ${this.formatPunchTime(dayPunches[i].punchTime)}`);
            }
          }
        }
      }
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

  /*Helper Method to calculate difference between two times ex. 12:00 to 14:45  */
  differentBetweenTwoTimes(start: string, end: string): number[] {
    const startHours = parseInt(start.substring(0, 2));
    const startMinutes = parseInt(start.substring(3, 5));
    const endHours = parseInt(end.substring(0, 2));
    const endMinutes = parseInt(end.substring(3, 5));

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    let difference = endTotalMinutes - startTotalMinutes;
    if (difference < 0) {
      difference += 24 * 60;
    }
    // Convert the difference back to hours and minutes
    const diffHours = Math.floor(difference / 60);
    const diffMinutes = difference % 60;
    return [diffHours, diffMinutes]
  }

  /* Helper Method To format punch time */
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

  /* This Method for rendering the punches in the template */
  isPunchInThisDay(punch: Punch, date: Date): boolean {
    const newDate = new Date(punch.punchDate);
    return newDate.getFullYear() === date.getFullYear()
      && newDate.getMonth() === date.getMonth()
      && newDate.getDate() === date.getDate();
  }

  /* Method For Admin to Swap to his punches */
  viewMyPunches() {
    this.userService.getUsersContaingName(this.punchService.getCurrentUserName()).subscribe((data) => {
      this.punchService.UserEmailToAddPunchFromAdmin = data[0].email || '';
      this.punchService.currentUsername.next(this.punchService.getCurrentUserName())
    })
  }

  openPunchModal() {
    this.modalService.open(this.punchModal);
  }

  punchClicked(p: Punch) {
    if (this.authService.isManager()) {
      this.punchToDelete = p;
      this.modalService.open(this.deletePunchModal)
    }
  }

  deletePunch() {
    if (this.authService.isManager()) {
      if (this.punchToDelete) {
        this.punchService.deletePunch(this.getUserEmailToAddPunchByAdmin(), this.punchToDelete.punchDate, this.punchToDelete.punchTime).subscribe({
          next: () => {
            this.getUserPunches();
            this.modalService.dismissAll()
            console.log("punchDeleted");

          },
          error: (err) => {
            this.modalService.dismissAll(); console.log("punch not Deleted", err);

          }
        });
      }
    }
  }

  toggoleDatePicker(event: MouseEvent) {
    event.preventDefault;
    this.viewDatePicker = !this.viewDatePicker;
  }
  toggoleTimePicker(event: MouseEvent) {
    event.preventDefault();
    this.viewTimePicker = !this.viewTimePicker;
  }


  /* Call the Add Punch API from Punch Service */
  async addPunch() {
    const type = this.punchType;
    // Formating picked Date For The Punch
    const formattedMonth = this.pickedPunchDate.month.toString().length === 1 ? '0' + this.pickedPunchDate.month.toString() : this.pickedPunchDate.month.toString();
    const formattedDay = this.pickedPunchDate.day.toString().length === 1 ? '0' + this.pickedPunchDate.day.toString() : this.pickedPunchDate.day.toString();
    const punchDate = this.pickedPunchDate.year + '-' + formattedMonth + '-' + formattedDay;
    // Formatting Piced Time For The Punch
    const formattedHour = this.pickedPunchTime.hour.toString().length === 1 ? '0' + this.pickedPunchTime.hour.toString() : this.pickedPunchTime.hour.toString();
    const formattedMinutes = this.pickedPunchTime.minute.toString().length === 1 ? '0' + this.pickedPunchTime.minute.toString() : this.pickedPunchTime.minute.toString();
    const punchTime = formattedHour + ':' + formattedMinutes;
    const userEmail = this.getUserEmailToAddPunchByAdmin();

    console.log(punchDate, " ", punchTime, " ", userEmail, " ", punchTime, " ", type);
    const currentDate = new Date();
    console.log("picked punch date", punchDate);

    if (this.punchService.UserEmailToAddPunchFromAdmin || this.authService.isManager()) { // If The User Is Admin, He can Add Punches With Date And Time
      const lastPunch = await this.punchService.getUserLastPunchByDateAndUserEmail(userEmail, punchDate).toPromise();

      const lastPunchTime = lastPunch?.punchTime ? lastPunch.punchTime : null;

      if (lastPunchTime && lastPunch?.punchTime) {
        const diff = this.differentBetweenTwoTimes(lastPunchTime, punchTime);
        console.log("diff", diff);
        if (diff[0] <= 0 && diff[1] <= 2) {
          this.lastPunchTimeMessage = `Cannot punch now: Last Punch ${lastPunch.punchDate}, ${this.formatPunchTime(lastPunch.punchTime)}`;
          setTimeout(() => this.resetAlertMessages(), 3000);
        } else {
          this.punchService.addNewPunch(punchDate, punchTime, type, userEmail).subscribe({
            next: (data) => {
              console.log(data);
              this.getUserPunches();
              this.punchAddedSuccessfully = true;
              setTimeout(() => this.resetAlertMessages(), 3000);
            },
            error: (error) => {
              console.log(error);
              this.punchNotAdded = true;
              setTimeout(() => this.resetAlertMessages(), 3000);
            }
          });
        }
      } else {
        this.punchService.addNewPunch(punchDate, punchTime, type, userEmail).subscribe({
          next: (data) => {
            console.log(data);
            this.getUserPunches();
            this.punchAddedSuccessfully = true;
            setTimeout(() => this.resetAlertMessages(), 3000);
          },
          error: (error) => {
            console.log(error);
            this.punchNotAdded = true;
            setTimeout(() => this.resetAlertMessages(), 3000);
          }
        });
      }
    }
    else {  // Normal User, He can Specify the punch type only
      const lastPunch = await this.punchService.getUserLastPunchByDateAndUsername(this.currentUsername, punchDate).toPromise();
      const lastPunchTime = lastPunch?.punchTime ? lastPunch.punchTime : null;
      if (lastPunch && lastPunchTime) {
        let currentHours = (currentDate.getHours() + '').length === 1 ? '0' + currentDate.getHours() : currentDate.getHours() + '';
        let currentMinutes = (currentDate.getMinutes() + '').length === 1 ? '0' + currentDate.getMinutes() : currentDate.getMinutes() + ''
        let currentTime = currentHours + ':' + currentMinutes;
        const diff = this.differentBetweenTwoTimes(lastPunchTime, currentTime);
        if (diff[0] <= 0 && diff[1] <= 2) {
          this.lastPunchTimeMessage = `Cannot punch now: Last Punch ${lastPunch.punchDate}, ${this.formatPunchTime(lastPunch.punchTime)}`;
          setTimeout(() => this.resetAlertMessages(), 3000);
        } else {
          this.punchService.punchNow(this.punchType).subscribe({
            next: (data) => {
              console.log(data);
              this.getUserPunches();
              this.punchAddedSuccessfully = true;
              setTimeout(() => this.resetAlertMessages(), 3000);
            },
            error: (error) => {
              console.log(error);
              this.punchNotAdded = true;
              setTimeout(() => this.resetAlertMessages(), 3000);
            }
          });
        }
      } else {
        this.punchService.punchNow(this.punchType).subscribe({
          next: (data) => {
            console.log(data);
            this.getUserPunches();
            this.punchAddedSuccessfully = true;
            setTimeout(() => this.resetAlertMessages(), 3000);
          },
          error: (error) => {
            console.log(error);
            this.punchNotAdded = true;
            setTimeout(() => this.resetAlertMessages(), 3000);
          }
        });
      }
    }
  }


  /* Method Returns The Email The adamin Wants To Add Punch For, Or the Current Username */
  getUserEmailToAddPunchByAdmin(): string {
    if (this.punchService.UserEmailToAddPunchFromAdmin) { // For The Admin When He Navigates To This Component From The Home Component, Picking Another User Email
      return this.punchService.UserEmailToAddPunchFromAdmin;
    }
    else if (this.authService.isManager()) {  // If the admin refresh the page and he want to add a punch for him, view his email
      this.userService.getUsersContaingName(this.punchService.getCurrentUserName()).subscribe((data) => {
        this.punchService.UserEmailToAddPunchFromAdmin = data[0].email || '';
      })
      return this.punchService.UserEmailToAddPunchFromAdmin;
    }
    else {  // For Normal User
      return this.currentUsername;
    }
  }




  ngOnDestroy(): void {
    this.punchService.UserEmailToAddPunchFromAdmin = '';
  }

  getWorkReminders(): string | undefined {
    const currentDate = new Date().toISOString().split("T")[0];
    return this.workReminder.get(currentDate + '')
  }

  getBreakReminders(): string | undefined {
    const currentDate = new Date().toISOString().split("T")[0];
    return this.breakReminder.get(currentDate + '')
  }



  isManager(): Boolean {
    return this.authService.isManager();
  }


  downloadReport() {
    this.jasperService.getUserReport(this.punchService.currentUserNameStr, this.weeks[0].toISOString().split('T')[0], this.weeks[this.weeks.length - 1].toISOString().split('T')[0])
      .subscribe((response: Blob) => {
        this.viewPdf(response);
      }, error => {
        console.error('Error downloading the report', error);
      });
  }

  viewPdf(pdf: Blob) {
    const url = window.URL.createObjectURL(pdf);
    window.open(url);
  }

  resetAlertMessages() {
    this.punchAddedSuccessfully = false;
    this.punchNotAdded = false;
    this.lastPunchTimeMessage = '';
  }

}



