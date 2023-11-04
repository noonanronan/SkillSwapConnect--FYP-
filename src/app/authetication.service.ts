// Import necessary Angular and Firebase modules.
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';

// The Injectable decorator marks it as a service that can be injected into other parts of the app.
@Injectable({
  providedIn: 'root' // servicce provided in the root level
})
export class AutheticationService {

  // Constructor to inject AngularFireAuth which provides Firebase authentication methods.
  constructor(public ngFireAuth: AngularFireAuth) { }

  // Method to register a user with email and password.
  async registerUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  // Method to log in a user with email and password.
  async loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  // Method to send a password reset link to the given email.
  async resetPassword(email: string): Promise<void> {
    return await this.ngFireAuth.sendPasswordResetEmail(email);
  }

  // Method to sign out the currently logged in user.
  async signOut(): Promise<void> {
    return await this.ngFireAuth.signOut();
  }

  // Method to get the current logged-in user's profile.
  async getProfile(): Promise<firebase.User | null> {
    return await this.ngFireAuth.currentUser;
  }
}
