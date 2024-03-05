import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimpleWebSocketService } from 'src/app/services/simple-web-socket.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
export class MessagingPage implements OnInit, OnDestroy {
  message = '';
  messages: any[] = [];

  constructor(private simpleWebSocketService: SimpleWebSocketService) {}

  ngOnInit() {
    this.simpleWebSocketService.connect('ws://localhost:8080/ws');
    this.simpleWebSocketService.messages$.subscribe((message) => {
      // Assume the message already includes a timestamp from the server
      this.messages.push(message);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      const messageWithTimestamp = {
        text: this.message,
        timestamp: new Date() // Add the current time as the timestamp
      };
      this.simpleWebSocketService.sendMessage(messageWithTimestamp);
      this.message = ''; // Clear the message input after sending
    }
  }
  

  ngOnDestroy(): void {
    this.simpleWebSocketService.disconnect();
  }
}