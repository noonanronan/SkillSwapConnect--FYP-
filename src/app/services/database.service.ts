import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase) {}

  // Function to update the user's bio
  updateUserBio(uid: string, bio: string): Promise<void> {
    return this.db.object(`users/${uid}`).update({ bio });
  }

  // Initialize user profile in the database
  initializeUserProfile(uid: string, name: string): Promise<void> {
    return this.db.object(`users/${uid}`).set({
      bio: '', // A default blank bio
      displayName: name // Set the display name
      // Add other initial user profile information here if needed
    });
  }

  // Function to retrieve the user's bio
  getUserBio(uid: string): firebase.database.Reference {
    return this.db.object(`users/${uid}`).query.ref;
  }

  // Update teach and learn preferences
  updateUserPreferences(uid: string, teach: boolean, learn: boolean, selectedTeachingOption: string, selectedLearningOption: string): Promise<void> {
    return this.db.object(`users/${uid}`).update({ 
      teach, 
      learn, 
      selectedTeachingOption, 
      selectedLearningOption 
    });
  }

  // Retrieve teach and learn preferences
  getUserPreferences(uid: string): firebase.database.Reference {
    return this.db.object(`users/${uid}`).query.ref;
  }
}