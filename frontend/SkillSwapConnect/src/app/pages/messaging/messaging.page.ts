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
    this.simpleWebSocketService.connect('ws://localhost:8080/ws'); // Ensure this matches your backend WebSocket endpoint

    this.simpleWebSocketService.messages$.subscribe((message) => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.simpleWebSocketService.sendMessage({ text: this.message });
      this.message = ''; // Clear the message input after sending
    }
  }

  ngOnDestroy(): void {
    this.simpleWebSocketService.disconnect();
  }
}
