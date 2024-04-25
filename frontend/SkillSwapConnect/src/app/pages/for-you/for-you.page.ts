import { Component, OnInit } from '@angular/core'; // Import the Component and OnInit modules
import { DatabaseService } from 'src/app/services/database.service'; // Import the DatabaseService
import { AutheticationService } from 'src/app/services/authetication.service'; // Import the AuthenticationService
import { Router } from '@angular/router'; // Import the Router module

@Component({
  selector: 'app-for-you',
  templateUrl: './for-you.page.html',
  styleUrls: ['./for-you.page.scss'],
})

// Export the ForYouPage class
export class ForYouPage implements OnInit {
  currentUserLearningSubjects: string[] = [];
  teachingMaterials: any[] = [];
  expandedMaterial: any = null;  // Track which material is expanded
  segmentValue: string = 'videos';


  // Inject the required services
  constructor(
    private databaseService: DatabaseService,
    public authService: AutheticationService,
    public route: Router
  ) {}

  // Initialize the component
  ngOnInit() {
    this.loadCurrentUserProfile();
  }

  // Load the current user's profile
  loadCurrentUserProfile() {
    this.databaseService.getCurrentUserProfile().then(profile => {
      this.currentUserLearningSubjects = profile.interests
        .filter(interest => interest.type === 'learn')
        .map(interest => interest.subject);

      this.fetchTeachingMaterials();
    }).catch(error => console.error('Error fetching profile:', error));
  }

  // Fetch teaching materials from the database
  fetchTeachingMaterials() {
    this.teachingMaterials = []; // Clear previous data
    this.databaseService.getAllUsers().then(users => {
      users.forEach(user => {
        if (user.interests && Array.isArray(user.interests)) {
          user.interests.forEach(interest => {
            if (interest.type === 'teach' && this.currentUserLearningSubjects.includes(interest.subject)) {
              if (user.teachingMaterials) {
                this.addMaterials(user.teachingMaterials, user);
              }
            }
          });
        }
      });
    });
  }

  // Add the materials to the teachingMaterials array
  addMaterials(materials, user) {
    if (materials.video) {
      materials.video.forEach(video => {
        this.teachingMaterials.push({...video, type: 'video', userName: user.displayName, userPhoto: user.photoURL});
      });
    }
    if (materials.notes) {
      materials.notes.forEach(note => {
        this.teachingMaterials.push({...note, type: 'notes', userName: user.displayName, userPhoto: user.photoURL});
      });
    }
  }

  // Check if the URL is a video
  isVideo(url: string): boolean {
    return /\.(mp4|avi)$/i.test(url);
  }

  // Play or pause the video
  playPause(videoPlayer: HTMLVideoElement) {
    if (videoPlayer.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  }

  // Toggle the expanded state of the material
  toggleMaterialDetail(material: any) {
    this.expandedMaterial = this.expandedMaterial === material ? null : material;
  }

}