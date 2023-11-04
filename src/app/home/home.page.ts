// Import necessary modules from Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AutheticationService } from '../authetication.service';
// Import the authentication service to handle user-related operations

// Define the component metadata
@Component({
  selector: 'app-home',  // This specifies the custom tag name for this component.
  templateUrl: 'home.page.html',  // Path to the component's HTML template.
  styleUrls: ['home.page.scss'],  // Path to the component's styles.
})
export class HomePage {
  user:any // Holds the user profile information.
  // The constructor initializes Router and AutheticationService when this component is instantiated.
  constructor(public route: Router, public authService: AutheticationService) {
    // Get the user's profile from the authentication service and assign to user property.
    this.user = authService.getProfile();
  }

 // Method to handle logout process.
 async logout() {
  this.authService.signOut()  // Attempt to sign out using the authentication service.
    .then(() => {
      // If sign out is successful, navigate to the landing page.
      this.route.navigate(['/landing']);
    })
    .catch((error) => {
      // If there's an error log the error to the console.
      console.log(error);
    });
}

}
