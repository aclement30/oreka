import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GoogleAuthService } from './services/google-auth.service';
import { AuthService } from './services/auth.service';

declare const oreka: any;

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.googleAuthService.waitForGoogleApi();

    this.authService.initUser().subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        // Retrieve user base data from server
        this.authService.loadBaseData()
          .subscribe((data: any) => {
            if (this.router.url === '/login') {
              this.router.navigate(['/dashboard']);
            }
          });
      } else {
        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  logout() {
    this.authService.logoutUser().subscribe(() => {
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }

  get isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}
