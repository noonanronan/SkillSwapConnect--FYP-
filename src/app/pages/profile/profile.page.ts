import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { AutheticationService } from 'src/app/authetication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  bio: string = '';

  constructor(public route: Router, public authService: AutheticationService) {} // Ensure AuthenticationService is correctly imported

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (user) => {
        this.user = user;
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
    // Update user bio logic
    console.log('Bio updated:', this.bio);
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
