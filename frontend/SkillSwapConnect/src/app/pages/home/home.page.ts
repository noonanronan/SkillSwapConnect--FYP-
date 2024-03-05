import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AutheticationService } from '../../services/authetication.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { AddImageService } from '../../services/add-image.service';
import { DatabaseService } from 'src/app/services/database.service';

/* Interface to define the structure of user profile data */
interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: UserProfile | null = null; // Holds the current user's profile data
  private authSubscription: Subscription; // Subscription to track authentication changes

  /* Properties for managing the list of subjects and filtered list based on search */
  filteredSubjects: string[] = [];
  selectedSubject: string;
  teachingOptions: string[] = [
    /* List of options for teaching subjects */
    'Music', 'Sports', 'Programming', 'Languages', 'Cooking', 
    'Art', 'Dance', 'Photography', 'Writing', 'Gaming', 
    'Yoga', 'Martial Arts', 'Gardening', 'DIY', 'Fitness', 
    'Coding', 'Design', 'Marketing', 'Finance', 'Business Strategy'
  ];

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>; // Reference to the file input element

  /* Constructor to inject services */
  constructor(
    public router: Router, 
    public authService: AutheticationService,
    private addImageService: AddImageService,
    private databaseService: DatabaseService,
  ) {
    // Initialize the filtered subjects list with all teaching options
    this.filteredSubjects = this.teachingOptions.slice();
  }

  ngOnInit(): void {
    // Subscribe to the authentication service to receive user data
    this.authSubscription = this.authService.currentUser.subscribe(
      async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch additional user details from the database
          const userDetails = await this.databaseService.getUserDetails(firebaseUser.uid);
          // Update local user profile data
          this.user = {
            uid: firebaseUser.uid,
            displayName: userDetails.displayName || 'User',
            email: firebaseUser.email,
            photoURL: userDetails.photoURL
          };
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the authentication service on component destruction
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  openUserListingPage() {
    this.router.navigateByUrl('/user-listing');
  }

  /* Filters the subjects based on the user's search input */
  setFilteredItems(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    // If the search term is empty, reset the list to show all options
    if (!searchTerm) {
      this.filteredSubjects = this.teachingOptions;
    } else {
      // Filter the list based on the search term
      this.filteredSubjects = this.teachingOptions.filter(subject => {
        return subject.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  }

  /* Handles the selection of a subject */
  onSubjectSelect(subject: string): void {
    console.log(`Subject selected: ${subject}`);
    // Navigate to the search results page with the selected subject as a query parameter
    this.router.navigate(['/search-results'], { queryParams: { subject: subject } });
  }

  /* Triggers the file input to open the file picker */
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  /* Handles file selection for profile image upload */
  async onFileSelected(event) {
    const file = event.target.files[0];
    if (file) {
      try {
        // Get the current user's profile
        const user = await this.authService.getProfile();
        if (user) {
          // Upload the selected file as the
           // profile image using the AddImageService
           await this.addImageService.addProfileImage(file, user.uid);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  
    /* Navigates to the user's profile page */
    goToProfile() {
      this.router.navigateByUrl('/profile');
    }
  
    /* Logs out the current user and navigates to the landing page */
    async logout(): Promise<void> {
      try {
        await this.authService.signOut();
        this.router.navigate(['/landing']);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  
    // Test method to demonstrate event binding (Using for debugging)
    testClick(): void {
      console.log('Input clicked');
    }
  }