import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor() { }

  ngOnInit() {
  }

  login() {
    // authentication logic here
    // For now, just print the email and password
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
