import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/backend-apis.service'; // Make sure the import path is correct

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
export class MessagingPage {
  message = '';

  constructor(private messageService: MessageService) {}

  sendMessage() {
    if (this.message.trim()) {
      this.messageService.sendMessage(this.message).subscribe(
        response => {
          console.log('Message sent successfully', response);
          this.message = ''; // Clear the input field on success
        },
        error => {
          console.error('Error sending message', error);
        }
      );
    }
  }
}
