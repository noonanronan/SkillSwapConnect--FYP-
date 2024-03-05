import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.page.html',
  styleUrls: ['./user-listing.page.scss'],
})
export class UserListingPage implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';

  constructor(private databaseService: DatabaseService, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
  }
  
  fetchUsers() {
    this.databaseService.getAllUsers().then(users => {
      this.users = users;
      this.filteredUsers = users;
    }).catch(error => console.error("Failed to fetch users:", error));
  }
  

  onSearchQueryChange() {
    this.filteredUsers = this.searchQuery ? this.users.filter(user =>
      user.displayName.toLowerCase().includes(this.searchQuery.toLowerCase())
    ) : this.users;
  }

  onUserSelect(user: any) {
    // Navigate to the messaging page with the selected user's ID
    this.router.navigate(['/messaging', { id: user.uid }]);
  }
}
