import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup 
  
  constructor(public route : Router ,public formBuilder:FormBuilder, public loadingCntrl: LoadingController, public authService: AutheticationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
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
    return this.loginForm?.controls;
  }

  // when i click this button it calls the sign up button
  async login(){
    const loading = await this.loadingCntrl.create();
    await loading.present();
    if(this.loginForm?.valid){
      const user = await this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).catch((error) =>{
        console.log(error);
        loading.dismiss()

      })

      if(user){
        loading.dismiss();
        this.route.navigate(['/home'])
      }else{
        console.log('provided correct values')
      }
    }
  }
}
