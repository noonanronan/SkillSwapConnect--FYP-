import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { AutheticationService } from 'src/app/services/authetication.service';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.page.html',
  styleUrls: ['./user-listing.page.scss'],
})
export class UserListingPage implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';

  constructor(
    private databaseService: DatabaseService,
    public authService: AutheticationService, 
    private router: Router
    ) {}

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
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredUsers = query ? this.users.filter(user =>
      user.displayName.toLowerCase().includes(query)
    ) : this.users;
  }
  

  onUserSelect(user: any) {
    this.authService.getCurrentUserId().then(currentUserId => {
      if (currentUserId) {
        const chatId = [currentUserId, user.uid].sort().join('_');
        // Navigate to the messaging page with the generated chat ID
        this.router.navigate(['/messaging', { chatId: chatId }]);
      }
    });
  }
}
