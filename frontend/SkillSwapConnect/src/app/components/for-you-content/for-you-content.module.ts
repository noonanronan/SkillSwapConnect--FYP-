import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ForYouContentComponent } from './for-you-content.component';

@NgModule({
  declarations: [ForYouContentComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [ForYouContentComponent]
})
export class ForYouContentModule {}
