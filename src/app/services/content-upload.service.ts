import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentUploadService {
  private storage = getStorage(initializeApp(environment.firebaseConfig));

  constructor() { }

  async uploadContent(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file); // Upload the file
    return getDownloadURL(storageRef); // Get the download URL
  }

}
