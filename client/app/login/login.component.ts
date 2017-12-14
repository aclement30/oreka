import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

import { GoogleAuthService } from '../services/google-auth.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private googleAuthService: GoogleAuthService,
    private router: Router,
  ) {}

  ngOnInit() {
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

  ngAfterViewInit() {
    this.googleAuthService.bindSignInButton(this.element.nativeElement.querySelector('button.google-oauth'));
  }
}
