import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  updatedPhotoURL: string; // Stores the updated photo URL after a successful upload
  user: User | null = null; // Currently authenticated user
  bio: string = ''; // User bio, editable and saved to the database
  // Flags to indicate whether the user is teaching or learning
  isTeaching = false;
  isLearning = false;
  selectedTeachingOption: string = ''; // User's selected teaching subject
  selectedLearningOption: string = ''; // User's selected learning subject
  teachingOptions: string[] = ['Music', 'Sports', 'Programming', 'Languages', 'Cooking', 
  'Art', 'Dance', 'Photography', 'Writing', 'Gaming', 
  'Yoga', 'Martial Arts', 'Gardening', 'DIY', 'Fitness', 
  'Coding', 'Design', 'Marketing', 'Finance', 'Business Strategy']; // Available teaching options
  learningOptions: string[] = this.teachingOptions; // Learning options mirror teaching options

  // Properties to track selected files
  selectedNotesFile: File | null = null;
  selectedVideoFile: File | null = null;

  selectedNotesName: string = ''; // Bind to the input field for notes name/title
  selectedVideoName: string = ''; // Bind to the input field for video name/title


  // Reference to the hidden file input for profile image upload
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(
    public route: Router, 
    public authService: AutheticationService,
    private databaseService: DatabaseService,
    private addImageService : AddImageService,
    private contentUploadService: ContentUploadService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to auth service to get and set the current user
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadUserPreferences(user.uid); // Load user preferences on init
        this.loadUserProfilePhoto(user.uid); // Fetch photo URL
      }
    });
  }

  async loadUserProfilePhoto(uid: string): Promise<void> {
    try {
      const userDetails = await this.databaseService.getUserDetails(uid);
      this.updatedPhotoURL = userDetails.photoURL; 
      this.changeDetectorRef.detectChanges(); // Trigger change detection to update the view
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }
  

  async onFileSelected(event) {
    // Handles file selection and uploads the selected file
    const file = event.target.files[0];
    if (file && this.user) {
      try {
        const newPhotoURL = await this.addImageService.addProfileImage(file, this.user.uid);
        this.updatedPhotoURL = newPhotoURL + `?t=${new Date().getTime()}`; // Cache-busting technique
        this.changeDetectorRef.detectChanges(); // Manually trigger change detection
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  triggerFileInput() {
    // Programmatically clicks the file input for uploading a new profile image
    this.fileInput.nativeElement.click();
  }

  loadUserPreferences(uid: string): void {
    // Loads user preferences such as bio, teaching/learning status and options
    this.databaseService.getUserPreferences(uid).then(snapshot => {
      const userData = snapshot.val();
      this.bio = userData.bio || '';
      // Reset states based on fetched preferences
      this.isTeaching = userData.roles?.includes('teacher');
      this.isLearning = userData.roles?.includes('learner');
      // Determine selected teaching and learning options based on user interests
      this.selectedTeachingOption = userData.interests?.find(i => i.type === 'teach')?.subject || '';
      this.selectedLearningOption = userData.interests?.find(i => i.type === 'learn')?.subject || '';
    }).catch(error => console.error(error));
  }

  goToHome() {
    // Navigate back to the home page
    this.route.navigateByUrl('/home');
  }

  async logout(): Promise<void> {
    // Logout the current user and navigate to the landing page
    try {
      await this.authService.signOut();
      this.route.navigate(['/landing']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  updateBio(): void {
    // Updates the user's bio in the database
    if (this.user) {
      this.databaseService.updateUserBio(this.user.uid, this.bio).then(() => {
        console.log('Bio updated:', this.bio);
      }).catch(error => console.error('Error updating bio:', error));
    }
  }

  updateRole(role: 'teach' | 'learn', isSelected: boolean): void {
    // Updates the user's role (teach/learn) based on selection
    this.isTeaching = role === 'teach' ? isSelected : this.isTeaching;
    this.isLearning = role === 'learn' ? isSelected : this.isLearning;
    this.updatePreferences(); // Update user preferences after role change
  }

  updatePreferences(): void {
    // Save the updated preferences (roles and interests) to the database
    if (!this.user) return;
    let roles = [];
    let interests = [];
    if (this.isTeaching) {
      roles.push('teacher');
      interests.push({ type: 'teach', subject: this.selectedTeachingOption });
    }
    if (this.isLearning) {
      roles.push('learner');
      interests.push({ type: 'learn', subject: this.selectedLearningOption });
    }
    this.databaseService.updateUserPreferences(this.user.uid, { roles, interests })
      .then(() => console.log('Preferences updated'))
      .catch(error => console.error('Error updating preferences:', error));
  }

  storeFile(event: any, type: 'notes' | 'video'): void {
    const file: File = event.target.files[0];
    if (type === 'notes') {
      this.selectedNotesFile = file;
      // Assume you have a mechanism to capture the name/title
      // Maybe an input field tied to `selectedNotesName`
    } else if (type === 'video') {
      this.selectedVideoFile = file;
      // Similarly, capture the video title into `selectedVideoName`
    }
  }

  async uploadMaterials(): Promise<void> {
    // Check if we have a notes file and a title
    if (this.selectedNotesFile && this.selectedNotesName.trim()) {
      await this.uploadFile(this.selectedNotesFile, 'notes', this.selectedNotesName);
      this.selectedNotesFile = null; // Reset the file input
      this.selectedNotesName = ''; // Reset the input field for the next upload
    }
    
    // Check if we have a video file and a title
    if (this.selectedVideoFile && this.selectedVideoName.trim()) {
      await this.uploadFile(this.selectedVideoFile, 'video', this.selectedVideoName);
      this.selectedVideoFile = null; // Reset the file input
      this.selectedVideoName = ''; // Reset the input field for the next upload
    }
  }

  private async uploadFile(file: File, type: 'notes' | 'video', name: string): Promise<void> {
    if (!this.user || !this.selectedTeachingOption) return;
    const path = `teaching_materials/${this.selectedTeachingOption}/${type}/${name}`;
    try {
      const downloadURL = await this.contentUploadService.uploadContent(file, path);
      await this.databaseService.updateTeachingMaterial(this.user.uid, { url: downloadURL, name }, type);
      console.log(`${type} uploaded successfully:`, downloadURL);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    }
  }
}