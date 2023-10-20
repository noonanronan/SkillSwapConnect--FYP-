import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignUpPage implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Confirm Password:', this.confirmPassword);
  }
}
