import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AutheticationService } from '../../services/authetication.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { AddImageService } from '../../services/add-image.service';
import { DatabaseService } from 'src/app/services/database.service';

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
  user: UserProfile | null = null; // To use the interface
  private authSubscription: Subscription;

  // Property for filtered subjects
  filteredSubjects: string[] = [];
  selectedSubject: string;
  teachingOptions: string[] = [
    'Music', 'Sports', 'Programming', 'Languages', 'Cooking', 
    'Art', 'Dance', 'Photography', 'Writing', 'Gaming', 
    'Yoga', 'Martial Arts', 'Gardening', 'DIY', 'Fitness', 
    'Coding', 'Design', 'Marketing', 'Finance', 'Business Strategy'
  ];

  
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  
  // The constructor initializes Router and AuthenticationService when this component is instantiated.
  constructor(
    public router: Router, 
    public authService: AutheticationService,
    private addImageService : AddImageService,
    private databaseService: DatabaseService,
    )  {
      // Initialize filteredSubjects with teachingOptions
      this.filteredSubjects = this.teachingOptions.slice();
    }
  
    ngOnInit(): void {
      this.authSubscription = this.authService.currentUser.subscribe(
        async (firebaseUser) => {
          if (firebaseUser) {
            const userDetails = await this.databaseService.getUserDetails(firebaseUser.uid);
            // Update the local user object with details from the Realtime Database
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
      if (this.authSubscription) {
        this.authSubscription.unsubscribe();
      }
    }

    // Function to filter subjects as the user types
    setFilteredItems(event: any) {
      const searchTerm = event.target.value.toLowerCase();
  
      if (!searchTerm) {
        this.filteredSubjects = this.teachingOptions;
      } else {
        this.filteredSubjects = this.teachingOptions.filter(subject => {
          return subject.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
    }
  
    // Function to handle subject selection
    onSubjectSelect(subject: string): void {
      // Log the subject to ensure this method is called
      console.log(`Subject selected: ${subject}`);
      // Navigate to the search results page with the selected subject
      this.router.navigate(['/search-results'], { queryParams: { subject: subject } });
}

  
    triggerFileInput() {
      this.fileInput.nativeElement.click();
    }
  
    async onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          // Get the current user's ID
          const user = await this.authService.getProfile();
          if (user) {
            // Pass the file and user ID to the addProfileImage method
            await this.addImageService.addProfileImage(file, user.uid);
  
          
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  
    goToProfile() {
      this.router.navigateByUrl('/profile');
    }
  
    async logout(): Promise<void> {
      try {
        await this.authService.signOut();
        this.router.navigate(['/landing']);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  
    testClick(): void {
      console.log('Input clicked');
    }
  }