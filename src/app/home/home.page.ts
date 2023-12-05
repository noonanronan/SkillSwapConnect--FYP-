// Import necessary modules from Angular
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'; 
import { AutheticationService } from '../authetication.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { AddImageService } from '../services/add-image.service';// importing the service


@Component({
  selector: 'app-home', // This specifies the custom tag name for this component
  templateUrl: 'home.page.html', // Path to the component's HTML template
  styleUrls: ['home.page.scss'], // Path to the component's styles
})
export class HomePage implements OnInit, OnDestroy { // Implement both OnInit and OnDestroy
  user: User | null = null;  
  private authSubscription: Subscription; // This will hold the subscription to the auth service

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  // The constructor initializes Router and AuthenticationService when this component is instantiated.
  constructor(public route: Router, 
    public authService: AutheticationService,
    private addImageService : AddImageService) {}

  ngOnInit(): void {
    // Subscribe to the auth service to get user profile updates
    this.authSubscription = this.authService.currentUser.subscribe(
      (user) => {
        this.user = user; // Assign the user profile to the local user property
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Method to trigger the file input
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Method to handle file selection
  async onFileSelected(event) {
    // Get the file the user selected
    const file = event.target.files[0];
    // Check to see if a file was selected
    if (file) {
      try {
        const imageUrl = await this.addImageService.addProfileImage(file); // Upload the file using the addImageService
        const user = await this.authService.getProfile(); //  Get the current users profile
        // If make sure users logged in
        if (user) {
          await user.updateProfile({ photoURL: imageUrl }); // Update the user's profile in FB
          this.authService.updateCurrentUser(user);
        }
      } catch (error) {
        console.error('Error uploading file:', error); // log error if doesn't work
      }
    }
  }

  goToProfile() {
    this.route.navigateByUrl('/profile');
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