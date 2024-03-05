import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserListingPageRoutingModule } from './user-listing-routing.module';

import { UserListingPage } from './user-listing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserListingPageRoutingModule
  ],
  declarations: [UserListingPage]
})
export class UserListingPageModule {}
