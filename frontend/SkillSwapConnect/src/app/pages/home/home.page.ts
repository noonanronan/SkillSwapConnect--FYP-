import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { AutheticationService } from '../../services/authetication.service';
import { Subscription } from 'rxjs';
import { AddImageService } from '../../services/add-image.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ModalController } from '@ionic/angular';
import { ForYouContentComponent } from '../../components/for-you-content/for-you-content.component';



/* Interface to define the structure of user profile data */
interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  learningSubjects?: string[];
}

interface Subject {
  name: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: UserProfile | null = null; // Holds the current user's profile data
  private authSubscription: Subscription; // Subscription to track authentication changes
  isListVisible: boolean = false; // Controls visibility of the filtered subjects list

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
  materialsForYou: { videos: any[]; notes: any[] } = { videos: [], notes: [] }; // Holds the materials recommended for the user

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>; // Reference to the file input element

  allSubjects: Subject[] = [
    { name: 'Music', image: '/assets/icon/music.png' },
    { name: 'Sports', image: '/assets/icon/sports.png' },
    { name: 'Programming', image: '/assets/icon/programming.png' },
    { name: 'Languages', image: '/assets/icon/languages.png' },
    { name: 'Cooking', image: '/assets/icon/cooking.png' },
    { name: 'Art', image: '/assets/icon/art.png' },
    { name: 'Dance', image: '/assets/icon/dance.png' },
    { name: 'Photography', image: '/assets/icon/photography.png' },
    { name: 'Writing', image: '/assets/icon/writing.png' },
    { name: 'Gaming', image: '/assets/icon/gaming.png' },
    { name: 'Yoga', image: '/assets/icon/yoga.png' },
    { name: 'Martial Arts', image: '/assets/icon/martial_arts.png' },
    { name: 'Gardening', image: '/assets/icon/gardening.png' },
    { name: 'DIY', image: '/assets/icon/diy.png' },
    { name: 'Fitness', image: '/assets/icon/fitness.png' },
    { name: 'Design', image: '/assets/icon/design.png' },
    { name: 'Marketing', image: '/assets/icon/marketing.png' },
    { name: 'Finance', image: '/assets/icon/finance.png' },
    { name: 'Business Strategy', image: '/assets/icon/business.png' }
  ];

  private currentIndex = 0;

  displayedSubjects: Subject[] = [];
  private rotationInterval: any;

  /* Constructor to inject services */
  constructor(
    public router: Router, 
    public authService: AutheticationService,
    private addImageService: AddImageService,
    private databaseService: DatabaseService,
    public modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe({
        next: async (firebaseUser) => {
            if (firebaseUser) {
                console.log('Firebase User ID: ', firebaseUser.uid);
                const userDetails = await this.databaseService.getUserDetails(firebaseUser.uid);
                this.user = {
                    uid: firebaseUser.uid,
                    displayName: userDetails.displayName || 'User',
                    email: firebaseUser.email,
                    photoURL: userDetails.photoURL,
                    learningSubjects: userDetails.learningSubjects || []
                };
                console.log('Updated User Details: ', this.user);
                this.loadUserInterestsMaterials();
            }
        },
        error: (error) => console.error('Error in user data subscription:', error)
    });

  
    this.rotationInterval = setInterval(() => {
      this.rotateFeaturedSubjects();
    }, 5000); // Rotate every 2 seconds
  
    // Initial set of displayed subjects
    this.displayedSubjects = this.allSubjects.slice(0, 3);

  }
  

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    clearInterval(this.rotationInterval);
  }

  private rotateFeaturedSubjects(): void {
    // Calculate next index ensuring we loop back to the start if we reach the end
    this.currentIndex = (this.currentIndex + 3) % this.allSubjects.length;
    // Update displayed subjects starting from the current index
    this.displayedSubjects = this.allSubjects.slice(this.currentIndex, this.currentIndex + 3);
    // If the slice is too short (we're at the end of the array), append from the start of the array
    if (this.displayedSubjects.length < 3) {
      this.displayedSubjects = this.displayedSubjects.concat(this.allSubjects.slice(0, 3 - this.displayedSubjects.length));
    }
  }

  async loadUserInterestsMaterials() {
    if (this.user && this.user.learningSubjects && this.user.learningSubjects.length > 0) {
      console.log('Loading materials for subjects:', this.user.learningSubjects);
      try {
        const materials = await this.databaseService.getMaterialsBySubjects(this.user.learningSubjects);
        if (materials) {
          // Process the materials into videos and notes
          this.materialsForYou.videos = materials.filter(material => material.type === 'video');
          this.materialsForYou.notes = materials.filter(material => material.type === 'note');
          console.log('Materials for User Interests Loaded: ', this.materialsForYou);
        } else {
          console.log('No materials found for the subjects:', this.user.learningSubjects);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    } else {
      console.log('No learning subjects found for the user.');
    }
  }
  
  

  async openForYouSection() {
    console.log('Navigating to For You page');
    this.router.navigateByUrl('/for-you');
  }


  async loadMaterials() {
    if (this.user && this.user.learningSubjects) {
      try {
        console.log('Attempting to load materials for user:', this.user.uid);
        const materials = await this.databaseService.getMaterialsBySubjects(this.user.learningSubjects);
        if (materials) {
          // Separate the materials into videos and notes
          this.materialsForYou.videos = materials.filter(material => material.type === 'video');
          this.materialsForYou.notes = materials.filter(material => material.type === 'note');
          console.log('Loaded materials for user:', this.materialsForYou);
        } else {
          console.error('No materials found for the subjects:', this.user.learningSubjects);
        }
      } catch (error) {
        console.error('Failed to fetch materials', error);
      }
    }
  }
  
  

  /* Filters the subjects based on the user's search input */
  setFilteredItems(event: any): void {
    console.log("Filtering items...");
    const searchTerm = event.target.value.toLowerCase();
    // If the search term is empty, reset the list to show all options
    if (!searchTerm) {
      this.filteredSubjects = this.teachingOptions.slice();
    } else {
      // Filter the list based on the search term
      this.filteredSubjects = this.teachingOptions.filter(subject => {
        return subject.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    this.isListVisible = !!this.filteredSubjects.length; // Show the list if there are filtered subjects
  }

  /* Handles the selection of a subject */
  onSubjectSelect(subjectName: string): void {
    this.router.navigate(['/search-results'], { queryParams: { subject: subjectName } });
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

    onSearchBarBlur(): void {
      // Use a delay to wait for the click event before hiding the list
      // Delay hiding the list to catch click event on items
      setTimeout(() => this.isListVisible = false, 300);
    }
  
    /* Navigates to the user's profile page */
    goToProfile() {
      this.router.navigateByUrl('/profile');
    }

    openUserListingPage(): void {
      console.log('Navigating to User Listing page');
      this.router.navigateByUrl('/user-listing'); // Ensure you have a route defined for '/user-listing'
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