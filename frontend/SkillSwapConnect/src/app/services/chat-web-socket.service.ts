import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {
  private stompClient: any; 
  private serverUrl = 'http://localhost:8080/ws'; 
  private messageSource = new Subject<any>();

  constructor() {}

  connect() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
        console.log('Connected to WebSocket');
        this.stompClient.subscribe('/topic/public', message => {
            const receivedMessage = JSON.parse(message.body);
            this.messageSource.next(receivedMessage); // Notify all subscribers
        });
    }, error => {
        console.error('Error in WebSocket connection:', error);
    });
  }

  sendMessage(messageContent: string): Observable<any> {
    return new Observable(subscriber => {
        if (this.stompClient && this.stompClient.connected) {
            const message = { message: messageContent };
            this.stompClient.send('/app/send', JSON.stringify(message), {});
            subscriber.next({status: 'Message sent'});
            subscriber.complete();
        } else {
            subscriber.error('WebSocket connection is not established.');
        }
    });
  }

  onMessage(): Subject<any> {
    return this.messageSource;
  }

  disconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
        console.log('Disconnected from WebSocket');
    }
  }
}
