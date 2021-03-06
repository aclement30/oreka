import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { environment } from 'environments/environment';
import { AsyncSubject, BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, filter, mergeMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CategoriesService } from './categories.service';

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
      gapi.load('auth2', this.onApiLoad);
    } else {
      setTimeout(this.waitForGoogleApi, 50);
    }
  }

  authenticateUser(): Observable<any> {
    return this.googleIdToken$
      .pipe(
        filter(Boolean),
        mergeMap((idToken: string) => {
          return this.requestAccessToken(idToken);
        }),
      );
  }

  requestAccessToken(googleToken: string): Observable<string> {
    return this.http.post<any>(environment.apiEndpoint + '/access_token', { googleToken })
      .pipe(
        map((data: { token: string }) => {
          localStorage.setItem('oreka-token', data.token);
          this.token = data.token;
          this.userAuthenticated$.next(true);
          return data.token;
        }),
        catchError(() => {
          this.clearLocalUser();
          return throwError('Error while authenticating with backend server');
        }),
      );
  }

  /**
   * Logout user from Google
   */
  logoutUser(): Observable<any> {
    return this.apiLoaded$
      .pipe(
        take(1),
        mergeMap(() => {
          return from(gapi.auth2.getAuthInstance().signOut());
        }),
        mergeMap(() => {
          return super.logoutUser();
        }),
        tap(() => {
          this.googleIdToken$.next(null);
          this.userAuthenticated$.next(false);
        }),
      );
  }

  bindSignInButton(button: Element): void {
    this.apiLoaded$
      .pipe(
        take(1),
      )
      .subscribe(() => {
        gapi.auth2.getAuthInstance().attachClickHandler(button);
      });
  }

  private onApiLoad = () => {
    const auth2 = gapi.auth2.init({
      client_id: environment.googleClientId,
      scope: 'profile email',
      cookiepolicy: 'single_host_origin',
    });

    // Listen for changes to current user
    auth2.currentUser.listen(this.onUserChanged);
  }

  private onUserChanged = (googleUser) => {
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
