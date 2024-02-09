// Service to interact with Firebase database
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { User } from 'src/app/services/user.model'; 

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
  updateUserPreferences(uid: string, preferences: { roles: string[]; interests: any[] }): Promise<void> {
    return this.db.object(`users/${uid}`).update(preferences);
  }

  // Fetches user preferences from the database
  getUserPreferences(uid: string): Promise<any> {
    return this.db.database.ref(`/users/${uid}`).once('value');
  }  

  

  // Method to fetch users teaching a specific subject
  searchUsersBySubject(subject: string, callback: (users: User[]) => void): void {
    this.db.list<User>('/users').valueChanges().subscribe(users => {
      const filteredUsers = users.filter(user => 
        user.interests?.some(interest => 
          interest.subject === subject && interest.type === 'teach'
        )
      );
      console.log('Filtered users:', filteredUsers);
      callback(filteredUsers); // Invoke the callback with the filtered users
    }, error => {
      console.error("Error fetching users by subject:", error);
    });
  }
  


  

  // Gets detailed user information by their ID
  getUserDetails(userId: string): Promise<any> {
    return this.db.database.ref(`users/${userId}`).once('value').then(snapshot => snapshot.val())
      .catch(error => {
        console.error("Error fetching user details:", error);
        throw error;
      });
  }

}
