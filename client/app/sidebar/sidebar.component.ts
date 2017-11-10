import { Component } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})

export class SidebarComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logoutUser();
  }
}
