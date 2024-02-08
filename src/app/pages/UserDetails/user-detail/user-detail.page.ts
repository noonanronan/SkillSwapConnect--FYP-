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

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.databaseService.getUserDetails(this.userId).then(details => {
      this.userDetails = details;
      // Log to see if data is being retrieved correctly
      console.log(this.userDetails);
    }).catch(error => {
      console.error('Error fetching user details:', error);
    });
  }
}
