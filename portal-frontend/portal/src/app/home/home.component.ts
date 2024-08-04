import { Component, DoCheck, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/user-service/user.service';
import { Punch } from '../model/punch';
import { PunchService } from '../service/punch-service/punch.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateEmployeeRequest } from '../model/UpdateEmployeeRequest';
import { AuthenticationService } from '../service/authentication-service/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: []
})
export class HomeComponent implements OnInit {


  users!: User[];
  usersCount: number = 0;
  departments: string[] = ["All", "Software Development", "QA", "Mobile Development", "BA", "HR", "IT", "Product Development", "Marketing"]
  selected_department: string = this.departments[0];
  searchedEmployee: any;

  viewCharts: boolean = false;

  @ViewChild('deleteModal', { static: true }) deleteModal!: TemplateRef<any>;     
  userToDelete='';
  userDeletedSuccess='';
  userNotDeleted='';

  @ViewChild('updateModal', { static: true }) updateModal!: TemplateRef<any>;     
  userToUpdate!:User;
  userUpdatedSuccess='';
  userNotUpdated='';
  userName='';
  userPosition='';
  userEmail='';
  userJoiningDate='';
  userPhoneNumber='';
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  userDepartments: string[] = ["Software Development", "QA", "Mobile Development", "BA", "HR", "IT", "Product Development", "Marketing"]
  updatedUserDepartment='';
  userNames: string[]=[];
  userEmails: string[]=[];
  invalidEmail: boolean=false;
  emailAlreadyExist: boolean=false;
  nameAlreadyExist: boolean=false;
  constructor(private userService: UserService, private punshservice: PunchService,
     private router: Router,private modalService: NgbModal,private auth:AuthenticationService) {
  }
  checkNameExist(){
    if (this.checkName(this.userName)){
      this.nameAlreadyExist=true;
    }else{
      this.nameAlreadyExist=false;
    }
  }
  checkEmailExist(){
    if (this.checkEmail(this.userEmail)){
      this.emailAlreadyExist=true;
    }else{
      this.emailAlreadyExist=false;
    }
    if(!this.userEmail.match(this.emailPattern)){
      this.invalidEmail=true;
    }
    else{
      this.invalidEmail=false;
    }
  }
  ngOnInit(): void {
    this.getUsersByDepartment();
    this.getUsersNames_Emails();
  }

  getUsersNames_Emails() {
    this.userService.getAllUserNames().subscribe((data)=>{
      this.userNames=data;
    })
    this.userService.getAllUserEmails().subscribe((data)=>{
      this.userEmails=data;
    })
  }

  openDeleteModal(userEmail:string){
    this.userToDelete=userEmail;
    this.modalService.open(this.deleteModal);
  }
  openUpdateModal(user: User) {
    this.userToUpdate=user;
    this.userName=user.name;
    this.userEmail=user.email;
    this.userPosition=user.position;
    this.userPhoneNumber=user.phoneNumber;
    this.updatedUserDepartment=user.department;
    this.userJoiningDate=user.joiningDate.toString();
    this.modalService.open(this.updateModal);   
   }

    updateUser(){
      if(!this.userEmail.match(this.emailPattern)){this.invalidEmail=true;setTimeout(()=>{this.invalidEmail=false},3000); return;}
      if(this.checkEmail(this.userEmail)){this.emailAlreadyExist=true;setTimeout(()=>{this.emailAlreadyExist=false},3000);return;}
      if(this.checkName(this.userName)){this.nameAlreadyExist=true;setTimeout(()=>{this.nameAlreadyExist=false},3000);return;}
       const updateRequest:UpdateEmployeeRequest = new UpdateEmployeeRequest(
        this.userName,
        this.mapDepartmentToEnums(this.updatedUserDepartment),
        this.userEmail,
        this.userPosition,
        this.userPhoneNumber,
        this.userJoiningDate,
      )
      console.log(updateRequest);
      
      this.userService.updateUser(this.userToUpdate.email,updateRequest).subscribe({
        next:()=>{this.userUpdatedSuccess="User Details Updated"; 
          if(this.auth.getCurrentUserName()===this.userToUpdate.name){
            this.modalService.dismissAll();
            this.auth.logout();
            this.router.navigateByUrl('signin'); }   
          setTimeout(()=>{this.userUpdatedSuccess=''},3000);
             this.getUsersByDepartment();
      },
        error:(err)=>{this.userNotUpdated="Error Updating User. Refresh ths Page And Try Again";setTimeout(()=>{this.userNotUpdated=''},3000)}
      })
    }

  getUsersByDepartment() {
    if (this.selected_department === "All")
      this.getAllUsers();
    else
      this.userService.getUsersBYDepartment(this.selected_department).subscribe((data) => {
        this.users = data
        this.usersCount = this.users.length;
      });
  }

  searchEmployeeByName() {
    this.userService.getUsersContaingName(this.searchedEmployee).subscribe((data => {
      this.users = data;
      this.usersCount = this.users.length;
    }))
  }

  changeCollectedUsers() {
    this.getUsersByDepartment()
  }


  getAllUsers(): void {
    this.userService.getAllUsers().subscribe((resposne) => {
      this.users = resposne; this.usersCount = this.users.length;
    })
  }

  getUserPunchesSorted(user: User): Punch[] {
    const sortedPunches: Punch[] = user.punches.sort((a, b) => {
      const dateA = new Date(a.punchDate + 'T' + a.punchTime);
      const dateB = new Date(b.punchDate + 'T' + b.punchTime);
      return dateA.getTime() - dateB.getTime();
    });
    return sortedPunches;
  }

  getFirstPunchTime(user: User): string[] {
    const lastPunch = this.getUserPunchesSorted(user)[this.getUserPunchesSorted(user).length - 1]
    const sortedPunches = this.getUserPunchesSorted(user).filter((p) => p.punchDate === lastPunch.punchDate);

    let firstTimePunch = ''
    if (sortedPunches.length > 0) {
      firstTimePunch = sortedPunches[0]?.punchTime;
      let firstPuchDate = sortedPunches[0]?.punchDate;
      firstTimePunch = firstTimePunch.substring(0, firstTimePunch.length - 3);
      return [firstPuchDate, this.formatPunchTime(firstTimePunch)];
    }
    return ["No Punches", ""]
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

  getlastPunchTime(user: User): string[] {
    const lastPunch = this.getUserPunchesSorted(user)[this.getUserPunchesSorted(user).length - 1]
    const sortedPunchesByDATE = this.getUserPunchesSorted(user).filter((p) => p.punchDate === lastPunch.punchDate);
    let lastTimePunch = ''
    if (sortedPunchesByDATE.length > 1) {
      lastTimePunch = sortedPunchesByDATE[sortedPunchesByDATE.length - 1]?.punchTime;
      let lastPunchDate = sortedPunchesByDATE[sortedPunchesByDATE.length - 1]?.punchDate;
      lastTimePunch = lastTimePunch.substring(0, lastTimePunch.length - 3);
      return [lastPunchDate, this.formatPunchTime(lastTimePunch)];
    }
    return ["No Punches", ""];

  }

  goToAttendanceOfEmployee(employeeName: string, employeeEmail: string) {
    this.punshservice.currentUsername.next(employeeName);
    this.punshservice.UserEmailToAddPunchFromAdmin = employeeEmail;
    this.router.navigateByUrl("/attendance")
  }

  deleteUser() {
    this.userService.deleteByEmail(this.userToDelete).subscribe({
      next: (data) => { 
        this.userDeletedSuccess=`User ${this.userToDelete} Deleted Successfully`;
        if(this.auth.getCurrentUserName()===this.userToUpdate.name){
          this.modalService.dismissAll();
          this.auth.logout();
          this.router.navigateByUrl('signin'); } 
        this.getUsersByDepartment();
        setTimeout(()=>this.userDeletedSuccess='',3000);
      },
      error: (error) => { console.log("error deleting user: ", error);
        this.userNotDeleted=`Errorr Deleting User ${this.userToDelete}. Refresh the page and try again`;
        setTimeout(()=>this.userNotDeleted='',3000);

      }
    }
    )
  }

  checkName(name: string): boolean {
    return this.userNames.some(n => n === name);
  }
  checkEmail(email: string): boolean {
    return this.userEmails.some(n => n === email);
  }
  mapDepartmentToEnums(departmentEnum: string): string {
    if (departmentEnum === "Mobile Development")
      return "MOBILE_DEVELOPMENT"
    if (departmentEnum === "Software Development")
      return "SOFTWARE_DEVELOPMENT"
     if (departmentEnum === "Product Development")
      return "PRODUCT_DEVELOPMENT"
    return departmentEnum;
  }

  formatDepartmentEnums(departmentEnum: string): string {
    if (departmentEnum === "MOBILE_DEVELOPMENT")
      return "Mobile Development"
    if (departmentEnum === "SOFTWARE_DEVELOPMENT")
      return "Software Development"
    return departmentEnum
  }
toggleViewCharts(event:Event){
  event.preventDefault()
  this.viewCharts=!this.viewCharts;
}
}



