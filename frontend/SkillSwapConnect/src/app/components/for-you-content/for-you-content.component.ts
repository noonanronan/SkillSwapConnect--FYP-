import { Component, OnInit, Input } from '@angular/core';

// Define an interface to represent the structure of materials
interface Materials {
  videos: any[]; 
  notes: any[];  
}

@Component({
  selector: 'app-for-you-content',
  templateUrl: './for-you-content.component.html',
  styleUrls: ['./for-you-content.component.scss']
})
export class ForYouContentComponent implements OnInit {
  
  // Use the Materials interface for the materials input
  @Input() materials: Materials = { videos: [], notes: [] }; 
  
  constructor() { }
  
  ngOnInit(): void {
    // Log received materials to the console
    console.log('Received materials:', this.materials);
  }

}
