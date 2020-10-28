import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { GoogleAuthService } from '../services/google-auth.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private router: Router,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.authService.authenticateUser()
      .subscribe(() => {
        // Retrieve user base data from server
        this.authService.loadBaseData()
          .subscribe((data: any) => {
            if (this.router.url === '/login') {
              this.router.navigate(['/dashboard']);
            }
          });
      });
  }

  ngAfterViewInit(): void {
    (this.authService as GoogleAuthService).bindSignInButton(this.element.nativeElement.querySelector('button.google-oauth'));
  }

  get language(): string {
    return this.translate.currentLang;
  }

  switchLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('oreka-language', language);
  }
}
