// Service to interact with Firebase database
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { User } from 'src/app/services/user.model'; 
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth ) {}

  // Method to fetch all users in DatabaseService
  async getAllUsers(): Promise<any[]> {
    const snapshot = await this.db.database.ref('/users').once('value');
    const usersObject = snapshot.val();
    if (!usersObject) return []; // Return an empty array if no users found
  
    const usersArray = Object.keys(usersObject).map(key => ({
      ...usersObject[key],
      uid: key // Ensure UID is added to the user object
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
  searchUsersBySubject(subject: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.db.list<User>('/users').snapshotChanges().pipe(
        map(actions => actions.map(a => ({
          uid: a.payload.key,
          ...a.payload.val() as User,
          photoURL: a.payload.val().photoURL || 'assets/default-profile.png' // Uses a default photoURL if not present
        })))
      ).subscribe(users => {
        const filteredUsers = users.filter(user => 
          user.interests?.some(interest => 
            interest.subject === subject && interest.type === 'teach'
          )
        );
        resolve(filteredUsers);
      }, error => {
        console.error("Error fetching users by subject:", error);
        reject(error);
      });
    });
  }
  
  // Gets detailed user information by their ID
  async getUserDetails(userId: string): Promise<any> {
    return this.db.database.ref(`users/${userId}`).once('value').then(snapshot => {
        const userDetails = snapshot.val();
        console.log("User Details Fetched: ", userDetails);
        if (userDetails && userDetails.interests) {
            userDetails.learningSubjects = userDetails.interests
                .filter(interest => interest.type === 'learn')
                .map(interest => interest.subject);
            console.log("Learning Subjects Extracted: ", userDetails.learningSubjects);
        }
        return userDetails;
    });
}

async getCurrentUserProfile(): Promise<any> {
  const user = await this.afAuth.currentUser;
  if (user) {
    return this.db.database.ref(`/users/${user.uid}`).once('value').then(snapshot => snapshot.val());
  }
  throw new Error('User not logged in');
}

  // Method to update the user's profile image URL
  async updateUserPhotoURL(uid: string, photoURL: string): Promise<void> {
    const userRef = this.db.object(`users/${uid}`);
    await userRef.update({ photoURL });
  }

  // Method to fetch teaching materials for a user
  async updateTeachingMaterial(uid: string, material: { url: string, name: string }, materialType: 'notes' | 'video'): Promise<void> {
    const materialsRef = this.db.object(`users/${uid}/teachingMaterials/${materialType}`);
    const materialsSnapshot = await materialsRef.query.ref.once('value');
    const materials = materialsSnapshot.val() ? [...materialsSnapshot.val(), material] : [material];

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

  async deleteMaterial(userId: string, material: any, type: 'video' | 'notes'): Promise<void> {
    const path = `users/${userId}/teachingMaterials/${type}`;
    const materialsRef = this.db.object(path);
    const materialsSnapshot = await materialsRef.query.ref.once('value');
    let materials = materialsSnapshot.val();
  
    if (materials) {
      materials = materials.filter((m: any) => m.url !== material.url);
      await materialsRef.set(materials);
    }
  }

  // Method to fetch materials based on multiple subjects
  getMaterialsBySubjects(subjects: string[]): Promise<any[]> {
    console.log(`Fetching materials for subjects: ${subjects.join(', ')}`);
    const promises = subjects.map(subject =>
      this.db.list(`/materials/${subject}`).valueChanges().pipe(take(1)).toPromise()
    );
  
    return Promise.all(promises).then(materials => {
      const flattenedMaterials = materials.flat();
      console.log(`Materials fetched for subjects: ${JSON.stringify(flattenedMaterials)}`);
      return flattenedMaterials;
    }).catch(error => {
      console.error(`Error fetching materials for subjects: ${error}`);
      return [];
    });
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