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

  constructor(public route: Router, 
    public authService: AutheticationService,
    private databaseService: DatabaseService
    ) {} 

    ngOnInit(): void {
      this.authService.currentUser.subscribe(
        (user) => {
          this.user = user;
          if (user) {
            // Fetch the current bio from the database
            this.databaseService.getUserBio(user.uid).once('value', (snapshot) => {
              if (snapshot.exists()) {
                this.bio = snapshot.val().bio; 
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