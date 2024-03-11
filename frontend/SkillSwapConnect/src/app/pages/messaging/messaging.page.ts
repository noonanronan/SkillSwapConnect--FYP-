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
  chatPartner: any;

  constructor(
    private route: ActivatedRoute,
    private simpleWebSocketService: SimpleWebSocketService,
    public authService: AutheticationService,
    private databaseService: DatabaseService,
    private changeDetectorRef: ChangeDetectorRef
    ) {}

    async ngOnInit() {
      this.currentUserId = await this.authService.getCurrentUserId(); // Get the current user ID
      console.log('Current User ID:', this.currentUserId); // Log the current user ID for verification
    
      this.simpleWebSocketService.connect('ws://localhost:8080/ws');
      this.simpleWebSocketService.messages$.subscribe((message) => {
        console.log('Message received from WebSocket:', message);
        this.messages.push(message);
        this.changeDetectorRef.detectChanges(); // Update the view
      });
    
      const chatId = this.route.snapshot.paramMap.get('chatId');
      console.log('Current chatId from route:', chatId);
    
      if (chatId) {
        const partnerId = chatId.replace(this.currentUserId, '').replace('_', '');
        this.fetchChatPartner(partnerId);
        this.subscribeToMessages(chatId);
        this.databaseService.getChatMessages(chatId).subscribe((messages) => {
          console.log('Received messages from Firebase subscription:', messages);
          this.messages = this.processMessages(messages);
          this.changeDetectorRef.detectChanges(); // Update the view
        }, error => {
          console.error("Error subscribing to chat messages:", error);
        });
      }
    }

    async fetchChatPartner(partnerId: string) {
      // Fetch the user details from the database
      const partnerDetails = await this.databaseService.getUserDetails(partnerId);
      this.chatPartner = partnerDetails;
      this.changeDetectorRef.detectChanges(); // Update the view with the new details
    }
  
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

  processMessages(messages: any[]): any[] {
  if (messages.length === 0) return [];

  // Sort messages by timestamp to ensure they are in order
  messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Process messages to add 'displayDate' where needed
  const processedMessages = [];
  let lastDisplayedDate = null;

  for (const message of messages) {
    const messageDate = new Date(message.timestamp);
    const dateStr = messageDate.toDateString();

    if (lastDisplayedDate !== dateStr) {
      // This is a new day, so we'll mark this message to display the date
      message.displayDate = messageDate;
      lastDisplayedDate = dateStr;
    } else {
      message.displayDate = null;
    }

    processedMessages.push(message);
  }
  return processedMessages;
}


  ngOnDestroy(): void {
    this.simpleWebSocketService.disconnect();
  }
}