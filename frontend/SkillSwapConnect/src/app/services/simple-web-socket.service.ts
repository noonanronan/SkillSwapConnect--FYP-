import { Injectable } from '@angular/core'; // Import the Injectable decorator
import { Observable, Subject } from 'rxjs'; // Import the Observable and Subject classes
import { AutheticationService } from './authetication.service'; // Import the authentication service

@Injectable({
  providedIn: 'root',
})
export class SimpleWebSocketService {
  private webSocket: WebSocket; // WebSocket instance
  private messagesSubject = new Subject<any>(); // Subject for messages
  public messages$: Observable<any> = this.messagesSubject.asObservable(); // Observable for messages
  private reconnectAttempts = 0; // Number of reconnect attempts
  private readonly maxReconnectAttempts = 5; // Maximum number of reconnect attempts
  private readonly reconnectDelay = 3000; // Delay between reconnect attempts in milliseconds
  private messageQueue: any[] = []; // Queue for messages that could not be sent

  constructor(private authService: AutheticationService) {}

  public async connect(url: string): Promise<void> {
    try {
      const token = await this.authService.getIdToken();
      const wsUrl = `${url}?token=${token}`; // Append token to WebSocket URL

      if (this.webSocket) {
        this.webSocket.close(); // Close the existing WebSocket connection
      }

      this.webSocket = new WebSocket(wsUrl); 
      this.webSocket.onopen = () => { // Set up event listeners
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0; // Reset the number of reconnect attempts
        this.clearMessageQueue(); // Send any queued messages
      };

      this.webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); // Parse the received data
          if (typeof data === 'object' && data !== null) {
            this.messagesSubject.next(data); // Push the parsed JSON data to subscribers
          } else {
            console.error('Received data is not a valid object:', data);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      this.webSocket.onerror = (error) => {
        console.error('WebSocket error:', error); // Log any errors
      };

      this.webSocket.onclose = (event) => {
        console.log('WebSocket connection closed', event.reason); 
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) { // Reconnect if the connection was not closed intentionally
          setTimeout(() => this.connect(url), this.reconnectDelay); // Reconnect after a delay
          this.reconnectAttempts++; // Increment the number of reconnect attempts
        }
      };
    } catch (error) {
      console.error("Error obtaining ID token for WebSocket connection:", error);
    }
  }

  
  public sendMessage(message: any): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      console.log('Sending message to server:', message);
      this.webSocket.send(JSON.stringify(message)); // Send the message as JSON
    } else {
      console.error('WebSocket is not open. Queuing message.', message);
      this.messageQueue.push(message); // Queue the message if the connection is not open
      this.connect(this.webSocket.url); // Try to reconnect if the connection is not open
    }
  }
  
  
  private clearMessageQueue(): void {
    while (this.messageQueue.length > 0) { // Send all queued messages
      const message = this.messageQueue.shift(); // Remove the first message from the queue
      this.sendMessage(message); // Send the message
    }
  }

  public disconnect(): void {
    if (this.webSocket) {
      this.webSocket.close(); // Close the WebSocket connection
    }
  }
}