import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { AutheticationService } from 'src/app/services/authetication.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ContentUploadService } from 'src/app/services/content-upload.service'; // Ensure correct path

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  bio: string = '';
  teach: boolean = false; // Will be true if the user selects "Teach"
  learn: boolean = false; // Will be true if the user selects "Learn"
  selectedTeachingOption: string; // Currently selected teaching option
  selectedLearningOption: string; // Currently selected learning option
  
  teachingOptions: string[] = [
    'Music', 'Sports', 'Programming', 'Languages', 'Cooking', 
    'Art', 'Dance', 'Photography', 'Writing', 'Gaming', 
    'Yoga', 'Martial Arts', 'Gardening', 'DIY', 'Fitness', 
    'Coding', 'Design', 'Marketing', 'Finance', 'Business Strategy'
  ]; // Array to allow user to select multiple options
  learningOptions: string[] = [
    'Music', 'Sports', 'Programming', 'Languages', 'Cooking', 
    'Art', 'Dance', 'Photography', 'Writing', 'Gaming', 
    'Yoga', 'Martial Arts', 'Gardening', 'DIY', 'Fitness', 
    'Coding', 'Design', 'Marketing', 'Finance', 'Business Strategy'
  ]; // Array to allow user to select multiple options

  // Add properties to track selected files
  selectedNotesFile: File | null = null;
  selectedVideoFile: File | null = null;

  constructor(
    public route: Router, 
    public authService: AutheticationService,
    private databaseService: DatabaseService,
    private contentUploadService: ContentUploadService
  ) {} 

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (user) => {
        this.user = user;
        if (user) {
          // Fetch the current bio and preferences from the database
          this.databaseService.getUserPreferences(user.uid).once('value', (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              this.bio = userData.bio;
              this.teach = userData.teach;
              this.learn = userData.learn;
              this.selectedTeachingOption = userData.selectedTeachingOption;
              this.selectedLearningOption = userData.selectedLearningOption;
            }
          });
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  goToHome() {
    this.route.navigateByUrl('/home');
  }
  
  updateBio() {
    // Bio update logic
  }

  updatePreferences() {
    // Preferences update logic
  }

  async logout() {
    // Logout logic
  }

  // Modified to store the selected file instead of uploading immediately
  storeFile(event: any, type: 'notes' | 'video') {
    const file: File = event.target.files[0];
    if (type === 'notes') {
      this.selectedNotesFile = file;
    } else if (type === 'video') {
      this.selectedVideoFile = file;
    }
    // Reminder alert users that files are ready for upload
  }

  // New method to upload stored files
  async uploadMaterials() {
    if (this.selectedNotesFile) {
      await this.uploadFile(this.selectedNotesFile, 'notes');
      this.selectedNotesFile = null; // Reset after successful upload
    }
    if (this.selectedVideoFile) {
      await this.uploadFile(this.selectedVideoFile, 'video');
      this.selectedVideoFile = null; // Reset after successful upload
    }
    // Provide user feedback about the upload status 
  }

  // Utility method for uploading a file
  private async uploadFile(file: File, type: 'notes' | 'video') {
    const path = `teaching_materials/${this.selectedTeachingOption}/${type}`;
    try {
      const downloadURL = await this.contentUploadService.uploadContent(file, path);
      console.log(`${type} uploaded successfully:`, downloadURL);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    }
  }
}
