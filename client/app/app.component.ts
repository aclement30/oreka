import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.googleAuthService.waitForGoogleApi();

    this.translate.setDefaultLang('fr');

    // Use user-selected language or fallback on browser language
    const language = localStorage.getItem('oreka-language') || this.translate.getBrowserLang();
    this.translate.use(language);

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
