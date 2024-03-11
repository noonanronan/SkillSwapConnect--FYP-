import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { SimpleWebSocketService } from 'src/app/services/simple-web-socket.service';
import { AutheticationService } from 'src/app/services/authetication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
/**
 * Represents the messaging page of the application.
 * This page is responsible for displaying and sending messages in a chat.
 */
export class MessagingPage implements OnInit, OnDestroy {
  message = '';
  messages: any[] = []; // This array holds received messages
  currentUserId: string;

  constructor(
    private route: ActivatedRoute,
    private simpleWebSocketService: SimpleWebSocketService,
    public authService: AutheticationService,
    private databaseService: DatabaseService,
    private changeDetectorRef: ChangeDetectorRef
    ) {}

    async ngOnInit() {
      this.simpleWebSocketService.connect('ws://localhost:8080/ws');
      this.simpleWebSocketService.messages$.subscribe((message) => {
        console.log('Message received from WebSocket:', message);
        this.messages.push(message); // This line ensures that any new message from WebSocket is added to the messages array
      });
    
      const chatId = this.route.snapshot.paramMap.get('chatId');
      console.log('Current chatId from route:', chatId);

      if (chatId) {
        this.subscribeToMessages(chatId);
        this.databaseService.getChatMessages(chatId).subscribe((messages) => {
          console.log('Received messages from Firebase subscription:', messages);
          this.messages = messages;
          this.changeDetectorRef.detectChanges(); // Manually trigger change detection
        }, error => {
          console.error("Error subscribing to chat messages:", error);
        });
      }
    }
  
    // Implement the isCurrentUser method
    isCurrentUser(senderId: string): boolean {
      return senderId === this.currentUserId;
    }
    

    async sendMessage() {
      const chatId = this.route.snapshot.paramMap.get('chatId'); // Retrieve the chat ID
      if (this.message.trim() && chatId) {
        const senderId = await this.authService.getCurrentUserId();
        const messageWithTimestampAndSender = {
          text: this.message,
          timestamp: new Date().toISOString(),
          senderId: senderId,
          chatId: chatId // Include the chat ID with the message
        };
        console.log(`Sending message to chatId ${chatId}:`, messageWithTimestampAndSender);
        this.simpleWebSocketService.sendMessage(messageWithTimestampAndSender);
        this.message = ''; // Clear the input field after sending
      }
    }

  async loadMessages(chatId: string) {
    this.messages = await this.databaseService.loadChatMessages(chatId);
  }


  subscribeToMessages(chatId: string) {
    this.databaseService.getChatMessages(chatId).subscribe((messages) => {
      this.messages = messages;
      this.changeDetectorRef.detectChanges(); // Trigger change detection manually
    });
  }

  ngOnDestroy(): void {
    this.simpleWebSocketService.disconnect();
  }
}