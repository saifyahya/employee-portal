import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication-service/authentication.service';
import { PunchService } from '../service/punch-service/punch.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  badCredentialsMessage = false;
  constructor(private formBuilder: FormBuilder, 
    private authService: AuthenticationService, 
    private router :Router) { }

  ngOnInit(): void {
    this.buildSigninForm();
  }

  buildSigninForm() {
    const passwordPattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#$%&? "]).*$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.loginForm = this.formBuilder.group({
      userData: this.formBuilder.group({
        email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)]),
        password: new FormControl('', [Validators.required, Validators.pattern(passwordPattern)])
      })
    });
  }

  submitLogin() {
    const email = this.loginForm.get('userData.email')?.value;
    const password = this.loginForm.get('userData.password')?.value;
    console.log('email: ' + email + " password: " + password);
    this.authService.login(email, password).subscribe({
      next: (res) => { console.log(res) ; 
      this.router.navigateByUrl('/attendance')},
      error: (err) => { 
        console.log(err) ; 
        this.badCredentialsMessage=true;
      }
    });
  }

  get email() {
    return this.loginForm.get('userData.email');
  }

  get password() {
    return this.loginForm.get('userData.password');
  }

}
