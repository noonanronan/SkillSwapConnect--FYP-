import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {
  subject: string;
  users: any[]; 

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.subject = this.route.snapshot.queryParamMap.get('subject');
    console.log(`Looking up users for subject: ${this.subject}`);
    this.databaseService.searchUsersBySubject(this.subject).then(users => {
      console.log(users);
      this.users = users;
    });
  }
}
