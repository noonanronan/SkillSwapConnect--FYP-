import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/services/user.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {
  subject: string;
  users: User[]; // Use the User interface for type definition

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subject = this.route.snapshot.queryParamMap.get('subject');
    console.log(`Looking up users for subject: ${this.subject}`);
    
    // Pass a callback function to update the component's state
    this.databaseService.searchUsersBySubject(this.subject, (filteredUsers) => {
      this.users = filteredUsers;
      this.changeDetectorRef.detectChanges(); // Trigger change detection to update the UI
    });
  }
}
