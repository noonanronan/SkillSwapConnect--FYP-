import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from 'firebase/auth';
import { AutheticationService } from 'src/app/services/authetication.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ContentUploadService } from 'src/app/services/content-upload.service';
import { AddImageService } from '../../services/add-image.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})

export class ProfilePage implements OnInit {
  user: User | null = null;
  bio: string = '';
  // Properties to track if the user wants to teach or learn
  isTeaching = false;
  isLearning = false;
  selectedTeachingOption: string = ''; // The teaching option selected by the user
  selectedLearningOption: string = ''; // The learning option selected by the user
  teachingOptions: string[] = ['Music', 'Sports', 'Programming', 'Languages', 'Cooking', 
  'Art', 'Dance', 'Photography', 'Writing', 'Gaming', 
  'Yoga', 'Martial Arts', 'Gardening', 'DIY', 'Fitness', 
  'Coding', 'Design', 'Marketing', 'Finance', 'Business Strategy']; 
  learningOptions: string[] = this.teachingOptions;

  // Properties to track selected files
  selectedNotesFile: File | null = null;
  selectedVideoFile: File | null = null;

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(
    public route: Router, 
    public authService: AutheticationService,
    private databaseService: DatabaseService,
    private addImageService : AddImageService,
    private contentUploadService: ContentUploadService
  ) {}

  ngOnInit(): void {
  this.authService.currentUser.subscribe(user => {
    this.user = user;
    if (user) {
      this.loadUserPreferences(user.uid);
    }
  });
}

async onFileSelected(event) {
  const file = event.target.files[0];
  if (file) {
    try {
      // Assuming you have a method to upload the image and update the user profile
      await this.addImageService.addProfileImage(file, this.user.uid);
      // After uploading, you might want to update the displayed user photoURL
      // This might involve fetching the updated user data or updating the local state
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}


triggerFileInput() {
  this.fileInput.nativeElement.click();
}

loadUserPreferences(uid: string): void {
  this.databaseService.getUserPreferences(uid).then(snapshot => {
    const userData = snapshot.val();
    this.bio = userData.bio || '';

    // Reset states
    this.isTeaching = false;
    this.isLearning = false;
    this.selectedTeachingOption = '';
    this.selectedLearningOption = '';

    // Check and apply roles
    if (userData.roles && userData.roles.includes('teacher')) {
      this.isTeaching = true;
      // Find the teaching subject from interests if it exists
      const teachInterest = userData.interests?.find(i => i.type === 'teach');
      this.selectedTeachingOption = teachInterest ? teachInterest.subject : '';
    }
    if (userData.roles && userData.roles.includes('learner')) {
      this.isLearning = true;
      // Find the learning subject from interests if it exists
      const learnInterest = userData.interests?.find(i => i.type === 'learn');
      this.selectedLearningOption = learnInterest ? learnInterest.subject : '';
    }
  }).catch(error => console.error(error));
}

  goToHome() {
    this.route.navigateByUrl('/home');
  }

  // Method to handle logout process.
  async logout(): Promise<void> {
    try {
      await this.authService.signOut(); // Attempt to sign out using the authentication service.
      this.route.navigate(['/landing']); // If sign out is successful, navigate to the landing page.
    } catch (error) {
      console.error('Logout error:', error); // If there's an error log the error to the console.
    }
  }

  updateBio(): void {
    if (this.user) {
      this.databaseService.updateUserBio(this.user.uid, this.bio).then(() => {
        console.log('Bio updated:', this.bio);
      }).catch(error => console.error('Error updating bio:', error));
    }
  }


  updateRole(role: 'teach' | 'learn', isSelected: boolean): void {
    if (role === 'teach') {
      this.isTeaching = isSelected;
    } else if (role === 'learn') {
      this.isLearning = isSelected;
    }
    // No longer automatically disabling the other role
    this.updatePreferences();
  }

  updatePreferences(): void {
    if (!this.user) return;
    
    // Prepare roles based on selections
    let roles = [];
    if (this.isTeaching) roles.push('teacher');
    if (this.isLearning) roles.push('learner');
  
    // Prepare interests based on selections
    let interests = [];
    if (this.selectedTeachingOption) interests.push({ type: 'teach', subject: this.selectedTeachingOption });
    if (this.selectedLearningOption) interests.push({ type: 'learn', subject: this.selectedLearningOption });
  
    const preferences = {
      roles: roles, // Store roles as an array
      interests: interests, // Store interests as an array of objects
    };
  
    this.databaseService.updateUserPreferences(this.user.uid, preferences).then(() => {
      console.log('Preferences updated');
    }).catch(error => console.error('Error updating preferences:', error));
  }
  
  

  storeFile(event: any, type: 'notes' | 'video'): void {
    const file: File = event.target.files[0];
    if (type === 'notes') {
      this.selectedNotesFile = file;
    } else if (type === 'video') {
      this.selectedVideoFile = file;
    }
  }

  async uploadMaterials(): Promise<void> {
    if (this.selectedNotesFile) {
      await this.uploadFile(this.selectedNotesFile, 'notes');
      this.selectedNotesFile = null;
    }
    if (this.selectedVideoFile) {
      await this.uploadFile(this.selectedVideoFile, 'video');
      this.selectedVideoFile = null;
    }
  }

  private async uploadFile(file: File, type: 'notes' | 'video'): Promise<void> {
    if (!this.user || !this.selectedTeachingOption) return;
    const path = `teaching_materials/${this.selectedTeachingOption}/${type}`;
    try {
      const downloadURL = await this.contentUploadService.uploadContent(file, path);
      console.log(`${type} uploaded successfully:`, downloadURL);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    }
  }

  
}