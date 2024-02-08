import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'; 
import { AutheticationService } from '../../services/authetication.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { AddImageService } from '../../services/add-image.service';
import { DatabaseService } from 'src/app/services/database.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User | null = null;
  private authSubscription: Subscription;

  // New property for filtered subjects
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
        (user) => {
          this.user = user;
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
      // Navigate to the search results page with the selected subject
      this.router.navigateByUrl(`/search-results?subject=${encodeURIComponent(subject)}`);
    }
  
    triggerFileInput() {
      this.fileInput.nativeElement.click();
    }
  
    async onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const imageUrl = await this.addImageService.addProfileImage(file);
          const user = await this.authService.getProfile();
          if (user) {
            await user.updateProfile({ photoURL: imageUrl });
            this.authService.updateCurrentUser(user);
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