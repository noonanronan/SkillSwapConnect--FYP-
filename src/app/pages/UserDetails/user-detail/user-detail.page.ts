import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

// Add an interface for teaching materials if you haven't already
interface TeachingMaterial {
  title: string;
  description?: string;
  url: string; // Assuming there's a URL to the material
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  userId: string;
  userDetails: any;
  teachingMaterials: TeachingMaterial[] = []; // Initialize as empty array

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
      console.log(this.userDetails);
      // Assuming the teaching materials are part of the userDetails or need another call
      // Adapt the following to your data structure and fetching logic
      this.teachingMaterials = details.teachingMaterials || [];
    }).catch(error => {
      console.error('Error fetching user details:', error);
    });
  }
}
