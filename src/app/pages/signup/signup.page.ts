// Import necessary modules from Angular
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignUpPage implements OnInit {
  regForm: FormGroup 

  constructor(public formBuilder:FormBuilder, public loadingCntrl: LoadingController, public authService: AutheticationService, public router : Router) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
        fullname : ['', [Validators.required]],
        email : ['', [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
        ]],
        password: ['',[
          Validators.required,
          Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8]).{8,}")
        ]]

    })
  }

  get errorControl(){
    return this.regForm?.controls;
  }

  // when i click this button it calls the sign up button
  async signUp() {
    const loading = await this.loadingCntrl.create();
    await loading.present();
  
    if (this.regForm.valid) {
      const { fullname, email, password } = this.regForm.value;
  
      try {
        const userCredential = await this.authService.registerUser(email, password, fullname);
        // Handle successful registration
        console.log('User registered successfully!', userCredential);
        loading.dismiss();
        this.router.navigate(['/home']); // Navigate to the home page or a welcome page
      } catch (error) {
        // Handle errors from registration
        console.error('Registration error:', error);
        loading.dismiss();
      }
    } else {
      // Handle form validation errors
      console.error('Form not valid:', this.regForm.errors);
      loading.dismiss();
    }
  }

  
}
