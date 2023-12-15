import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { AutheticationService } from 'src/app/services/authetication.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

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
  teachingOptions: string[] = ['Math', 'Science', 'Art']; // // Array to allow user to select multiple options
  learningOptions: string[] = ['Physics', 'Painting', 'Music']; // // Array to allow user to select multiple options


  constructor(public route: Router, 
    public authService: AutheticationService,
    private databaseService: DatabaseService
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
    if (this.user) {
      this.databaseService.updateUserBio(this.user.uid, this.bio)
        .then(() => {
          console.log('Bio updated:', this.bio);
          // Show a success message
        })
        .catch((error) => {
          console.error('Error updating bio:', error);
          // Show an error message
        });
    }
  }

  updatePreferences() {
    if (this.user) {
      this.databaseService.updateUserPreferences(this.user.uid, this.teach, this.learn, this.selectedTeachingOption, this.selectedLearningOption)
        .then(() => {
          console.log('Preferences updated');
          // Show a success message
        })
        .catch((error) => {
          console.error('Error updating preferences:', error);
          // Show an error message
        });
    }
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
}