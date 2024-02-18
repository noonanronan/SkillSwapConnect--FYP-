import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  userId: string;
  userDetails: any;
  teachingMaterials: any = { videos: [], notes: [] }; // Adjusted to include videos and notes
  segmentValue = 'videos'; // Default to videos

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.fetchData();
  }

  fetchData() {
    this.databaseService.getUserDetails(this.userId).then(details => {
      this.userDetails = details;
      // Example structure, adjust according to your data
      this.teachingMaterials.videos = details.teachingMaterials.videos || [];
      this.teachingMaterials.notes = details.teachingMaterials.notes || [];
    }).catch(error => {
      console.error('Error fetching user details:', error);
    });
  }
}
