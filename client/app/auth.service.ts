import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/observable/from';

import { User } from './models/user.model';

declare const gapi: any;
declare const GOOGLE_CLIENT_ID: string;

@Injectable()
export class AuthService {

  redirectUrl: string;
  currentUser$: AsyncSubject<User> = new AsyncSubject();

  private token: string;

  constructor(
    private router: Router,
    private zone: NgZone,
  ) {}

  initUser() {
    const userToken = localStorage.getItem('oreka-token');
    if (!userToken) {
      return;
    }

    const tokenExpiration = +localStorage.getItem('oreka-token-expiration');
    if (tokenExpiration < Math.floor(Date.now() / 1000)) {
      return;
    }

    this.token = userToken;
  }

  waitForGoogleApi = () => {
    if (typeof gapi !== 'undefined') {
      gapi.load('auth2', this.onGoogleApiLoad);
    } else {
      setTimeout(this.waitForGoogleApi, 50);
    }
  }

  onGoogleApiLoad = () => {
    const auth2 = gapi.auth2.init({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'profile email'
    });

    // Listen for changes to current user.
    auth2.currentUser.listen(this.userChanged);
  }

  userChanged = (googleUser) => {
    this.zone.run(() => {
      if (googleUser.isSignedIn()) {
        this.onAuthenticationSuccess(googleUser);
      } else {
        this.clearLocalUser();

        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  /**
   * Calling Google login API and fetching account details.
   * @param googleUser Current user
   */
  onAuthenticationSuccess(googleUser) {
    const profile = googleUser.getBasicProfile();
    const token = googleUser.getAuthResponse().id_token;

    // Setting user data in localstorage
    localStorage.setItem('oreka-token', token);
    localStorage.setItem('oreka-image', profile.getImageUrl());
    localStorage.setItem('oreka-name', profile.getName());
    localStorage.setItem('oreka-email', profile.getEmail());

    this.currentUser$.next({
      id: null,
      name: profile.getName(),
      email: profile.getEmail(),
      token,
      image: profile.getImageUrl(),
    });
    this.token = token;

    if (this.router.url === '/login') {
      const redirectUrl = this.redirectUrl || '/dashboard';
      this.router.navigate([redirectUrl]);
      this.redirectUrl = null;
    }
  }

  onAuthenticationFailure = (error) => {
    debugger
  }

  /**
   * Logout user from Google
   */
  logoutUser() {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      console.log('User signed out.');
      this.clearLocalUser();
    });
  }

  getToken(): string {
    return localStorage.getItem('oreka-token');
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Clearing Localstorage of browser
   */
  private clearLocalUser() {
    this.currentUser$ = new AsyncSubject();
    this.token = null;

    localStorage.removeItem('oreka-token');
    localStorage.removeItem('oreka-image');
    localStorage.removeItem('oreka-name');
    localStorage.removeItem('oreka-email');
  }
}
