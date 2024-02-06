// Service to interact with Firebase database
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase) {}

  // Updates the user's biography information in the database
  updateUserBio(uid: string, bio: string): Promise<void> {
    return this.db.object(`users/${uid}`).update({ bio });
  }

  // Initializes a new user profile with default settings
  initializeUserProfile(uid: string, name: string): Promise<void> {
    return this.db.object(`users/${uid}`).set({
      bio: '', // Start with a blank biography
      displayName: name // Set the user's display name
    });
  }

  // Retrieves the stored bio for a user
  getUserBio(uid: string): firebase.database.Reference {
    return this.db.object(`users/${uid}`).query.ref;
  }

  // Updates user preferences including their role and interests
  updateUserPreferences(uid: string, preferences: { role: string; interests: string[] }): Promise<void> {
    return this.db.object(`users/${uid}`).update(preferences);
  }

  // Fetches user preferences from the database
  getUserPreferences(uid: string): Promise<any> {
    return this.db.database.ref(`/users/${uid}`).once('value').then(snapshot => snapshot);
  }
}