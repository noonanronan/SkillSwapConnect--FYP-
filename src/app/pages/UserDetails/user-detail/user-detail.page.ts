import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  userId: string; // Variable to store the user ID from the route parameter
  userDetails: any; // Variable to store the user details fetched from the database
  teachingMaterials: any = { videos: [], notes: [] }; // Object to store arrays of videos and notes
  segmentValue = 'videos'; // Variable to control which segment is active (videos or notes)

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    // OnInit lifecycle hook to fetch data as soon as the component initializes
    this.userId = this.route.snapshot.paramMap.get('id'); // Gets the user ID from the route parameter
    this.fetchData(); // Calls fetchData to retrieve user details and teaching materials
  }

  fetchData() {
    // Method to fetch user details from the database
    this.databaseService.getUserDetails(this.userId).then(details => {
      // Once details are fetched, assign them to the userDetails variable
      this.userDetails = details;
      // Check if video teachingMaterials exist and are an array, then assign them
      if (details.teachingMaterials && Array.isArray(details.teachingMaterials.video)) {
        this.teachingMaterials.videos = details.teachingMaterials.video;
      } else {
        // If not, ensure videos is an empty array
        this.teachingMaterials.videos = [];
      }
      // Perform similar check and assignment for notes
      if (details.teachingMaterials && Array.isArray(details.teachingMaterials.notes)) {
        this.teachingMaterials.notes = details.teachingMaterials.notes;
      } else {
        // Ensure notes is an empty array if none exist
        this.teachingMaterials.notes = [];
      }
    }).catch(error => {
      // logging error
      console.error('Error fetching user details:', error);
    });
  }
}