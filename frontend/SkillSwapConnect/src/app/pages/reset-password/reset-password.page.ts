// Import necessary Angular modules.
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { log } from 'console';

// Import the authentication service to handle user-related operations.
import { AutheticationService } from 'src/app/services/authetication.service';

@Component({
  selector: 'app-reset-password',         // This specifies the custom tag name for this component.
  templateUrl: './reset-password.page.html',  // Path to the component's HTML template.
  styleUrls: ['./reset-password.page.scss'],  // Path to the component's styles.
})
export class ResetPasswordPage implements OnInit {
  email: any;  // Variable to store the email for which the password will be reset.

  // Constructor to inject Router and AuthenticationService.
  constructor(public route: Router, public authService: AutheticationService) {}

  ngOnInit() {
    
  }

  // Async function to handle the password reset process.
  async resetPassword() {
    // Call the resetPassword function of authService, passing the email.
    this.authService.resetPassword(this.email)
      .then(() => {
        console.log('reset link sent');  // Log message if reset link is successfully sent.
        this.route.navigate(['/login']);  // Navigate back to the login page after successful operation.
      })
      .catch((error) => {
        console.log(error);  // Log errors encountered during the process.
      });
  }
}
