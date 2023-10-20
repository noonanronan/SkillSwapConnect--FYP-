import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Don't forget to import Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  // Inject Router into your component
  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }

  // Method to handle forgot password click
  forgotPassword() {
    console.log('Forgot Password clicked');
    this.router.navigate(['/reset-password']); //path for resetting password
  }

  // Method to handle sign up click
  goToSignUp() {
    console.log('Go to Sign Up clicked');
    this.router.navigate(['/signup']); //Path for signing up
  }
}
