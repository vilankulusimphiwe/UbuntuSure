import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header.component';
import { Sidebar } from '../sidebar/sidebar.component';
import { Footer } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [Header, Sidebar, RouterOutlet, Footer],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayout {

  
  sidebarHidden = false;

  toggleSidebar() {
    if (this.sidebarHidden === true) {
      this.sidebarHidden = false;
    } else {
      this.sidebarHidden = true;
    }
  }
}