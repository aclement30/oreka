import { Injectable, NgZone } from '@angular/core';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

import { GOOGLE_CLIENT_ID } from '../config';

declare const gapi: any;

@Injectable()
export class GoogleAuthService {

  userAuthenticated$ = new BehaviorSubject<string | boolean>(null);
  private apiLoaded$ = new AsyncSubject<boolean>();

  constructor(
    private zone: NgZone,
  ) {}

  waitForGoogleApi = () => {
    if (typeof gapi !== 'undefined') {
      gapi.load('auth2', this._onApiLoad);
    } else {
      setTimeout(this.waitForGoogleApi, 50);
    }
  }

  /**
   * Logout user from Google
   */
  logoutUser(): Observable<any> {
    return this.apiLoaded$.take(1)
      .flatMap(() => {
        return Observable.fromPromise(gapi.auth2.getAuthInstance().signOut());
      })
      .do(() => {
        console.log('User signed out.');
        this.userAuthenticated$.next(false);
      });
  }

  bindSignInButton(button: Element): void {
    this.apiLoaded$.take(1).subscribe(() => {
      gapi.auth2.getAuthInstance().attachClickHandler(button);
    });
  }

  private _onApiLoad = () => {
    const auth2 = gapi.auth2.init({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'profile email',
      cookiepolicy: 'single_host_origin',
    });

    this.apiLoaded$.next(true);
    this.apiLoaded$.complete();

    // Listen for changes to current user
    auth2.currentUser.listen(this._onUserChanged);
  }

  private _onUserChanged = (googleUser) => {
    this.zone.run(() => {
      if (googleUser.isSignedIn()) {
        const token = googleUser.getAuthResponse().id_token;
        this.userAuthenticated$.next(token);
      } else {
        this.userAuthenticated$.next(false);
      }
    });
  }
}
