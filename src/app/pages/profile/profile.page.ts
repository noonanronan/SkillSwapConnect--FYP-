import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { AutheticationService } from 'src/app/services/authetication.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ContentUploadService } from 'src/app/services/content-upload.service';

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

  constructor(
    public route: Router, 
    public authService: AutheticationService,
    private databaseService: DatabaseService,
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

  loadUserPreferences(uid: string): void {
    this.databaseService.getUserPreferences(uid).then(snapshot => {
      const userData = snapshot.val();
      this.bio = userData.bio || '';
      // Handle both teaching and learning states
      this.isTeaching = userData.role.includes('teacher');
      this.isLearning = userData.role.includes('learner');
      this.selectedTeachingOption = userData.selectedTeachingOption || '';
      this.selectedLearningOption = userData.selectedLearningOption || '';
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
    
    // Assuming the role will be set based on what options are selected
    let role = this.isTeaching && this.isLearning ? 'both' : this.isTeaching ? 'teacher' : 'learner';
    let interests = [];
    if (this.selectedTeachingOption) interests.push(this.selectedTeachingOption);
    if (this.selectedLearningOption) interests.push(this.selectedLearningOption);
  
    const preferences = {
      role: role, // Use a string that indicates the user's role or roles
      interests: interests, // Combine teaching and learning options into a single array
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