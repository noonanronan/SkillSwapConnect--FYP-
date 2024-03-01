import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/services/user.model';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {
  subject: string; // Holds the search query parameter value
  users: User[]; // Array to store users matching the search criteria

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    // Retrieve the 'subject' query parameter from the current route
    this.subject = this.route.snapshot.queryParamMap.get('subject');
    console.log(`Looking up users for subject: ${this.subject}`);
    
    // Fetch users from the database who are associated with the selected subject
    this.databaseService.searchUsersBySubject(this.subject, (filteredUsers) => {
      this.users = filteredUsers; // Assign fetched users to the local array
      this.changeDetectorRef.detectChanges(); // Manually trigger change detection to ensure UI updates
    });
  }

  goToUserDetail(user: User) {
    // Navigate to the user detail page, passing the user's UID in the URL
    this.router.navigateByUrl(`/user-detail/${user.uid}`); 
  }
}
