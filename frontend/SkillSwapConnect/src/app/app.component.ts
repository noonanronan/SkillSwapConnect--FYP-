import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private menu: MenuController) {}

  openMenu() {
    this.menu.open();
  }

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    // Cleanup logic
  }
}
