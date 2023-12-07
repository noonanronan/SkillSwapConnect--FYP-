import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  // Hold messages for each feature card - They are initialized to empty strings.
  skillMessage: string = '';
  swapMessage: string = '';
  connectMessage: string = '';

  constructor() { }

  // Method to show the learn message - Clears after 2 seconds.
  showSkillMessage(): void {
    this.skillMessage = 'Share your skills and learn from others!';
    setTimeout(() => this.skillMessage = '', 2000);
  }

  // Method to show the share message - Clears after 2 seconds.
  showSwapMessage(): void {
    this.swapMessage = 'Meeting friends!';
    setTimeout(() => this.swapMessage = '', 2000);
  }

  // Method to show the connect message - Clears after 2 seconds.
  showConnectMessage(): void {
    this.connectMessage = 'Connect with peers and build your network!';
    setTimeout(() => this.connectMessage = '', 2000);
  }
}