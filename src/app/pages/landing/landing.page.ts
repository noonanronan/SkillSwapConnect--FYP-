// Import necessary Angular modules.
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',                // This specifies the custom tag name for this component.
  templateUrl: './landing.page.html',     // Path to the component's HTML template.
  styleUrls: ['./landing.page.scss'],     // Path to the component's styles.
})
export class LandingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
