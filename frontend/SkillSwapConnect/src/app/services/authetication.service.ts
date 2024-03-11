// Import necessary Angular and Firebase modules.
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';


// The Injectable decorator marks it as a service that can be injected into other parts of the app.
@Injectable({
  providedIn: 'root' // servicce provided in the root level
})
export class AutheticationService {

  // Constructor to inject AngularFireAuth which provides Firebase authentication methods.
  private currentUserSubject = new BehaviorSubject<firebase.User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(public ngFireAuth: AngularFireAuth,
    private databaseService: DatabaseService
    ) {
    this.ngFireAuth.authState.subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  
  updateCurrentUser(user: firebase.User) {
    this.currentUserSubject.next(user);
  }

  async registerUser(email: string, password: string, name: string): Promise<firebase.auth.UserCredential> {
    const credential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    const user = credential.user;
    if (user) {
      await user.updateProfile({ displayName: name });
      
      // Now use DatabaseService to initialize the user profile
      await this.databaseService.initializeUserProfile(user.uid, name);
      
      this.currentUserSubject.next(user); // Update the current user observable
    }
    return credential;
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

  async getIdToken(): Promise<string> {
    const user = await this.ngFireAuth.currentUser;
    if (!user) throw new Error('User not authenticated');
    return user.getIdToken();
  }

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.ngFireAuth.currentUser;
    return user ? user.uid : null;
  }
}