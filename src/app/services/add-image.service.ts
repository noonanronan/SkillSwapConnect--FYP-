import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment'; 
import { DatabaseService } from 'src/app/services/database.service'; // Correct path is essential


@Injectable({
  providedIn: 'root'
})
export class AddImageService {
  private storage = getStorage(initializeApp(environment.firebaseConfig));

  constructor(private databaseService: DatabaseService) { }

  async addProfileImage(file: File, userId: string): Promise<string> { // Change return type to Promise<string>
    const storageRef = ref(this.storage, `profile_images/${file.name}`);
    await uploadBytes(storageRef, file); // Upload the file
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL
    // Update the user's profile with the new image URL
    await this.databaseService.updateUserPhotoURL(userId, downloadURL);
    return downloadURL; // Return the download URL
  }
}