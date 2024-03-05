import { Component, OnInit } from '@angular/core';
import { ChatWebSocketService } from 'src/app/services/chat-web-socket.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
export class MessagingPage implements OnInit {
  message = '';
  messages: any[] = [];

  constructor(private chatWebSocketService: ChatWebSocketService) {}

  ngOnInit() {
    this.chatWebSocketService.connect();
    this.chatWebSocketService.onMessage().subscribe(message => {
        this.messages.push(message);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
        this.chatWebSocketService.sendMessage(this.message).subscribe({
            next: () => {
                console.log('Message sent successfully');
                this.messages.push({ text: this.message, senderId: 'You' }); // Temporarily display your message
                this.message = ''; // Clear the input field on success
            },
            error: (error) => {
                console.error('Error sending message:', error);
                // Optionally, inform the user that sending the message failed
            }
        });
    }
}

}
