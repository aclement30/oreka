import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

import { GOOGLE_CLIENT_ID, API_ENDPOINT } from '../config';
import { AuthService } from './auth.service';
import { CategoriesService } from './categories.service';
import { AppState } from '../store/index';

declare const gapi: any;

@Injectable()
export class GoogleAuthService extends AuthService {

  private googleIdToken$ = new BehaviorSubject<string>(null);
  private apiLoaded$ = new AsyncSubject<boolean>();

  constructor(
    protected categoriesService: CategoriesService,
    protected http: HttpClient,
    protected router: Router,
    protected store: Store<AppState>,
    protected zone: NgZone,
  ) {
    super(categoriesService, http, router, store);
  }

  waitForGoogleApi = () => {
    if (typeof gapi !== 'undefined') {
      gapi.load('auth2', this._onApiLoad);
    } else {
      setTimeout(this.waitForGoogleApi, 50);
    }
  }

  authenticateUser(): Observable<any> {
    return this.googleIdToken$.filter(Boolean)
      .flatMap((idToken: string) => {
        return this.requestAccessToken(idToken);
      });
  }

  requestAccessToken(googleToken: string): Observable<string> {
    return this.http.post<any>(API_ENDPOINT + '/access_token', { googleToken })
      .map((data: { token: string }) => {
        localStorage.setItem('oreka-token', data.token);
        this.token = data.token;
        this.userAuthenticated$.next(true);
        return data.token;
      })
      .catch(() => {
        this.clearLocalUser();
        return Observable.throw('Error while authenticating with backend server');
      });
  }

  /**
   * Logout user from Google
   */
  logoutUser(): Observable<any> {
    return this.apiLoaded$.take(1)
      .flatMap(() => {
        return Observable.fromPromise(gapi.auth2.getAuthInstance().signOut());
      })
      .flatMap(() => {
        return super.logoutUser();
      })
      .do(() => {
        this.googleIdToken$.next(null);
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

    // Listen for changes to current user
    auth2.currentUser.listen(this._onUserChanged);
  }

  private _onUserChanged = (googleUser) => {
    this.apiLoaded$.next(true);
    this.apiLoaded$.complete();

    this.zone.run(() => {
      if (googleUser.isSignedIn()) {
        const idToken = googleUser.getAuthResponse().id_token;
        this.googleIdToken$.next(idToken);
      }
    });
  }
}
