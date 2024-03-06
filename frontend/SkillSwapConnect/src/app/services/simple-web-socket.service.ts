import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SimpleWebSocketService {
  private webSocket: WebSocket;
  private messagesSubject = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject.asObservable();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5; // Max number of reconnect attempts
  private readonly reconnectDelay = 3000; // Delay between reconnect attempts in milliseconds
  private messageQueue: any[] = [];

  constructor() {}

  public connect(url: string): void {
    if (this.webSocket) {
      this.webSocket.close();
    }

    this.webSocket = new WebSocket(url);
    this.webSocket.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      this.clearMessageQueue(); // Optionally, send queued messages upon successful reconnection
    };

    this.webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messagesSubject.next(data);
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
  }

  public sendMessage(message: any): void {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      console.log('Sending message to server:', message);
      this.webSocket.send(JSON.stringify(message)); // Send the message object as JSON
    } else {
      console.error('WebSocket is not open. Queuing message.');
      this.messageQueue.push(message);
    }
  }
  
  private clearMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message); // Send each queued message
    }
  }

  public disconnect(): void {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
}
