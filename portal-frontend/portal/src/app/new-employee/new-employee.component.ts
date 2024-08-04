import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { AddEmployeeRequest } from '../model/addEmployeeRequest';
import { UserService } from '../service/user-service/user.service';
import { debounceTime, of, switchMap } from 'rxjs';
import e from 'express';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrl: './new-employee.component.css'
})
export class NewEmployeeComponent implements OnInit {

  model: { year: number; month: number; day: number; } | undefined;
  signupForm!: FormGroup;
  departments: string[] = ["Software Development", "QA", "Mobile Development", "BA", "HR", "IT", "Product Development", "Marketing"]
  viewDatePicker = false;
  userNames:string[]=[];
  userEmails:string[]=[];
  nameAlreadyExist: boolean=false;
  emailAlreadyExist: boolean=false;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router,private userService:UserService) { }  // Fixed typo: fromChildBuilder to formBuilder and aurhService to authService

  ngOnInit(): void {
    this.model = { year: 2024, month: 7, day: 30 }; // Default date
    this.getUsersNames_Emails();
    this.buildSignupForm();
  }
  getUsersNames_Emails() {
    this.userService.getAllUserNames().subscribe((data)=>{
      this.userNames=data;
    })
    this.userService.getAllUserEmails().subscribe((data)=>{
      this.userEmails=data;
    })
  }

  toggoleDatePicker(e: Event) {
    e.preventDefault()
    this.viewDatePicker = !this.viewDatePicker;
  }

  submitSignup() {
    
    const joiningDate: { year: number, month: number, day: number } = this.signupForm.get('userData.joining_date')?.value;
    let d = new Date();
    d.setFullYear(joiningDate.year)
    d.setMonth(joiningDate.month - 1)
    d.setDate(joiningDate.day);

  if(this.checkName(this.signupForm.get('userData.emp_name')?.value) ){
    this.nameAlreadyExist=true;
    return;
  }
  if(this.checkEmail(this.signupForm.get('userData.email')?.value) ){
    this.emailAlreadyExist=true;
    return;
  }
    let request = new AddEmployeeRequest(
      this.signupForm.get('userData.emp_name')?.value,
      this.mapDepartmentToEnums(this.signupForm.get('userData.department')?.value),
      this.signupForm.get('userData.email')?.value,
      this.signupForm.get('userData.position')?.value,
      this.signupForm.get('userData.password')?.value,
      this.signupForm.get('userData.phoneNumber')?.value,
      d.toISOString().split('T')[0]);

    this.authService.signup(request).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl('/signin')
      },
      error: (err) => {
        console.log(err);
      }
    })
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

  PasswordsMatches(g: FormGroup) {
    const passwordConfirm = g.get('passwordConfirm')?.value;
    const password = g.get('password')?.value;

    if (password !== passwordConfirm) {
      g.get('passwordConfirm')?.setErrors({ passwordMatchesError: true });
    } else {
    }
  }


  buildSignupForm() {
    const phoneNumberPattern = /^\+?[0-9]\d{9,14}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%&? "]).*$/;
    let date = new Date();
    this.signupForm = this.formBuilder.group({
      userData: this.formBuilder.group({
        emp_name: new FormControl('', [Validators.minLength(3), Validators.maxLength(15), Validators.required]),
        department: new FormControl(this.departments[0]),
        joining_date: new FormControl({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }),
        email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)]),
        phoneNumber: new FormControl('', [Validators.pattern(phoneNumberPattern), Validators.required]),
        position: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.pattern(passwordPattern)]),
        passwordConfirm: new FormControl('', [Validators.required, Validators.pattern(passwordPattern)]),
      }, { validators: this.PasswordsMatches })
    });
  }


  get email() {
    return this.signupForm.get('userData.email')
  }
  get password() {
    return this.signupForm.get('userData.password')
  }
  get passwordConfirm() {
    return this.signupForm.get('userData.passwordConfirm')
  }
  get emp_name() {
    return this.signupForm.get('userData.emp_name')
  }
  get department() {
    return this.signupForm.get('userData.department')
  }
  get phoneNumber() {
    return this.signupForm.get('userData.phoneNumber')

  }
  get joining_date() {
    return this.signupForm.get('userData.joining_date')

  }
  get position() {
    return this.signupForm.get('userData.position')

  }

}
