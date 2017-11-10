import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';

declare const oreka: any;

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.waitForGoogleApi();

    oreka.onAuthenticationFailure = this.authService.onAuthenticationFailure;
  }

  logout() {
    this.authService.logoutUser();
  }

  get isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}
