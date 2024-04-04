import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Import AngularFireModule and AngularFireAuthModule
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Import IonicModule
import { IonicModule } from '@ionic/angular';
import { AutheticationService } from './services/authetication.service';

// Import AngularFireStorageModule
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { HttpClientModule } from '@angular/common/http';

import { DatePipe } from '@angular/common'; // Import DatePipe

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    IonicModule.forRoot(), // Add IonicModule to your imports
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AutheticationService, DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // The CUSTOM_ELEMENTS_SCHEMA
})
export class AppModule { }