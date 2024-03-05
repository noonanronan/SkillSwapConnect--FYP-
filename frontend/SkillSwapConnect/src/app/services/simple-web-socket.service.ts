import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SimpleWebSocketService {
  private webSocket: WebSocket;
  private messagesSubject = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject.asObservable();
  private websocketUrl: string; // Store the WebSocket URL for reconnection attempts

  constructor() {}

  public connect(url: string): void {
    this.websocketUrl = url; // Store URL for potential reconnections
    if (!this.webSocket || this.webSocket.readyState === WebSocket.CLOSED) {
      this.webSocket = new WebSocket(url);

      this.webSocket.onmessage = (messageEvent) => {
        const message = JSON.parse(messageEvent.data);
        this.messagesSubject.next(message);
      };

      this.webSocket.onopen = () => {
        console.log('WebSocket connection established');
      };

      this.webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.webSocket.onclose = () => {
        console.log('WebSocket connection closed');
        // Automatically attempt to reconnect
        this.attemptReconnect();
      };
    }
  }

  private attemptReconnect(): void {
    console.log('Attempting to reconnect...');
    setTimeout(() => this.connect(this.websocketUrl), 1000); // Reconnect after 1 second
  }

  public sendMessage(message: any): void {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Attempting to reconnect...');
      this.attemptReconnect();
      // Optionally, queue the message or handle this case according to your app's needs
    }
  }

  public disconnect(): void {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
}
