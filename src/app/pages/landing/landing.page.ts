import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  // Hold messages for each feature card - They are initialized to empty strings.
  learnMessage: string = '';
  shareMessage: string = '';
  connectMessage: string = '';

  constructor() { }

  // Method to show the learn message - Clears after 2 seconds.
  showLearnMessage(): void {
    this.learnMessage = 'Learn and expand your knowledge!';
    setTimeout(() => this.learnMessage = '', 2000);
  }

  // Method to show the share message - Clears after 2 seconds.
  showShareMessage(): void {
    this.shareMessage = 'Share your skills and learn from others!';
    setTimeout(() => this.shareMessage = '', 2000);
  }

  // Method to show the connect message - Clears after 2 seconds.
  showConnectMessage(): void {
    this.connectMessage = 'Connect with peers and build your network!';
    setTimeout(() => this.connectMessage = '', 2000);
  }
}