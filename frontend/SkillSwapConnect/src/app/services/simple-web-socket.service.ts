import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AutheticationService } from './authetication.service';

@Injectable({
  providedIn: 'root',
})
export class SimpleWebSocketService {
  private webSocket: WebSocket;
  private messagesSubject = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject.asObservable();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000;
  private messageQueue: any[] = [];

  constructor(private authService: AutheticationService) {}

  public async connect(url: string): Promise<void> {
    try {
      const token = await this.authService.getIdToken();
      const wsUrl = `${url}?token=${token}`; // Append token to WebSocket URL

      if (this.webSocket) {
        this.webSocket.close();
      }

      this.webSocket = new WebSocket(wsUrl);
      this.webSocket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.clearMessageQueue();
      };

      this.webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
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
        console.error('WebSocket error:', error);
      };

      this.webSocket.onclose = (event) => {
        console.log('WebSocket connection closed', event.reason);
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => this.connect(url), this.reconnectDelay);
          this.reconnectAttempts++;
        }
      };
    } catch (error) {
      console.error("Error obtaining ID token for WebSocket connection:", error);
    }
  }

  
  public sendMessage(message: any): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      console.log('Sending message to server:', message);
      this.webSocket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Queuing message.', message);
      this.messageQueue.push(message);
      // Try to reconnect if the connection is not open
      this.connect(this.webSocket.url);
    }
  }
  
  
  private clearMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  public disconnect(): void {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
}