// Service to interact with Firebase database
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { User } from 'src/app/services/user.model'; 
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase ) {}

  // Method to fetch all users in DatabaseService
  async getAllUsers(): Promise<any[]> {
    const snapshot = await this.db.database.ref('/users').once('value');
    const usersObject = snapshot.val();
    const usersArray = Object.keys(usersObject).map(key => ({
      ...usersObject[key],
      uid: key // Add the UID to the user object
    }));
    return usersArray;
  }

  
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
    this.db.list<User>('/users').snapshotChanges().pipe(
      map(actions => actions.map(a => ({
        uid: a.payload.key,
        ...a.payload.val() as User,
        photoURL: a.payload.val().photoURL || 'assets/default-profile.png' // Uses a default photoURL if not present
      })))
    ).subscribe(users => {
      // Filter and callback logic as before
      const filteredUsers = users.filter(user => 
        user.interests?.some(interest => 
          interest.subject === subject && interest.type === 'teach'
        )
      );
      console.log('Filtered users:', filteredUsers);
      callback(filteredUsers); // Use the callback to pass filtered users
    }, error => {
      console.error("Error fetching users by subject:", error);
    });
  }
  
  // Gets detailed user information by their ID
  getUserDetails(userId: string): Promise<any> {
    return this.db.database.ref(`users/${userId}`).once('value').then(snapshot => snapshot.val());
  }

  // Method to update the user's profile image URL
  async updateUserPhotoURL(uid: string, photoURL: string): Promise<void> {
    const userRef = this.db.object(`users/${uid}`);
    await userRef.update({ photoURL });
  }

  // Method to fetch teaching materials for a user
  async updateTeachingMaterial(uid: string, materialUrl: string, materialType: 'notes' | 'video'): Promise<void> {
    const materialsRef = this.db.object(`users/${uid}/teachingMaterials/${materialType}`);
    const materials = (await materialsRef.query.ref.once('value')).val() || [];
    materials.push(materialUrl);
    
    await materialsRef.set(materials);
  }

  // Method to fetch teaching materials for a user
  async loadChatMessages(chatId: string): Promise<any[]> {
    const snapshot = await this.db.database.ref(`/messages/${chatId}`).once('value');
    if (snapshot.exists()) {
      const messagesArray = snapshotToArray(snapshot);
      return messagesArray;
    }
    return [];
  }

  // Real-time subscription to chat messages
  getChatMessages(chatId: string): Observable<any[]> {
    return new Observable((observer) => {
      const messagesRef = this.db.database.ref(`/messages/${chatId}`);
      messagesRef.on('value', (snapshot) => {
        const messagesArray = snapshotToArray(snapshot);
        observer.next(messagesArray);
      }, (errorObject) => {
        console.error("The read failed:", errorObject);
      });

      // Make sure to handle unsubscribe
      return () => messagesRef.off('value');
    });
  }
}

// Function to convert Firebase snapshot to array
function snapshotToArray(snapshot: firebase.database.DataSnapshot): any[] { 
  const returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val(); 
    try {
      item = JSON.parse(item); 
    } catch (e) {
      console.error('Error parsing JSON from Firebase:', e);
    }
    item = { ...item, key: childSnapshot.key };
    returnArr.push(item);
    return false; // Return false to continue forEach loop
  });

  return returnArr;
}
