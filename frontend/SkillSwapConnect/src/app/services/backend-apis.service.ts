import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService { 
    private apiUrl = 'http://localhost:8080/send'; // Update with your actual backend URL

    constructor(private http: HttpClient) {}

    // Here you update the method to send the message as an object
    sendMessage(message: string) {
        return this.http.post(this.apiUrl, { message }); // The backend now expects an object with a message property
    }
}
