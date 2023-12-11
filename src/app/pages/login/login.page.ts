// Import necessary Angular and Ionic modules
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/services/authetication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',             // This specifies the custom tag name for this component.
  templateUrl: './login.page.html',  // Path to the component's HTML template.
  styleUrls: ['./login.page.scss'],  // Path to the component's styles.
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;  // Represents the form group for the login form.

  // Constructor to inject services: Router, FormBuilder, LoadingController, and AuthenticationService.
  constructor(
    public route: Router,
    public formBuilder: FormBuilder,
    public loadingCntrl: LoadingController,
    public authService: AutheticationService
  ) {}

  ngOnInit() {
    // Initialize the login form with validators when the component gets initialized.
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8]).{8,}")
      ]]
    });
  }

  // A getter function to fetch form controls for better error handling in the template.
  get errorControl() {
    return this.loginForm?.controls;
  }

  // Async function to handle login action.
  async login() {
    // Create a loading spinner.
    const loading = await this.loadingCntrl.create();
    await loading.present();

    // Check if the form data is valid.
    if (this.loginForm?.valid) {
      // Attempt to log the user in using the provided email and password.
      const user = await this.authService.loginUser(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).catch((error) => {
        console.log(error);
        loading.dismiss(); // Dismiss the loading spinner if there's an error.
      });

      // If the user login is successful, navigate to the home page.
      if (user) {
        loading.dismiss();
        this.route.navigate(['/home']);
      } else {
        console.log('provided correct values');  // Log a failed login
      }
    }
  }
}
