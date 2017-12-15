import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/throw';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { API_ENDPOINT } from '../config';
import { AppState } from '../store/index';
import { User } from '../models/user.model';
import { ResetCouple, SetCouple } from '../store/couple.actions';
import { ResetUser, SetCurrentUser } from '../store/user.actions';
import { ResetCategories } from '../store/categories.actions';
import { ResetTransactions } from '../store/transactions.actions';
import { CategoriesService } from './categories.service';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class AuthService {
  redirectUrl: string;

  private tokenRefreshRequest$: Observable<string>;
  private token: string;

  constructor(
    private categoriesService: CategoriesService,
    private googleAuthService: GoogleAuthService,
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  initUser(): Observable<boolean> {
    const accessToken = localStorage.getItem('oreka-token');
    if (accessToken) {
      this.token = accessToken;
      return Observable.of(true);
    }

    return Observable.of(false);
  }

  authenticateUser(): Observable<any> {
    return this.googleAuthService.userAuthenticated$.filter(Boolean)
      .flatMap((googleToken: string) => {
        return this.requestAccessToken(googleToken);
      });
  }

  requestAccessToken(googleToken: string): Observable<string> {
    return this.http.post<any>(API_ENDPOINT + '/access_token', { googleToken })
      .map((data: { token: string }) => {
        localStorage.setItem('oreka-token', data.token);
        this.token = data.token;
        return data.token;
      })
      .catch(() => {
        this.clearLocalUser();
        return Observable.throw('Error while authenticating with backend server');
      });
  }

  // DOES NOT WORK
  refreshAccessToken(): Observable<string> {
    // Skip is token refresh process is already ongoing
    if (this.tokenRefreshRequest$) {
      return this.tokenRefreshRequest$;
    }

    const googleToken = this.googleAuthService.userAuthenticated$.getValue();
    if (googleToken === null) {
      return this.tokenRefreshRequest$ = this.googleAuthService.userAuthenticated$
        .filter((token) => (token !== null))
        .flatMap((token: string | boolean): Observable<string> => {
          return this._exchangeGoogleAuthToken(token);
        });
    }

    return this._exchangeGoogleAuthToken(googleToken);
  }

  loadBaseData(): Observable<any> {
    return forkJoin([
      this.fetchUser(),
      this.getCoupleMembers(),
      this.categoriesService.query(),
    ]);
  }

  fetchUser(): Observable<User> {
    return this.http.get<User>(API_ENDPOINT + '/users/profile').map((user: User): User => {
      this.store.dispatch(new SetCurrentUser(user));
      return user;
    });
  }

  getCoupleMembers(): Observable<User[]> {
    return this.http.get<User[]>(API_ENDPOINT + '/couples/members').map((coupleMembers: User[]): User[] => {
      coupleMembers[0].color = '#7761a7';
      coupleMembers[1].color = '#3d566d';

      this.store.dispatch(new SetCouple({ users: coupleMembers }));

      return coupleMembers;
    });
  }

  /**
   * Logout user
   */
  logoutUser(): Observable<any>  {
    return forkJoin([
      this.googleAuthService.logoutUser(),
      Observable.of(this.clearLocalUser()),
    ]);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  private _exchangeGoogleAuthToken(googleToken: string | boolean): Observable<string> {
    if (googleToken === false) {
      return Observable.throw('Google user is not authenticated');
    }

    return this.tokenRefreshRequest$ = this.requestAccessToken(googleToken as string)
      .do(() => { this.tokenRefreshRequest$ = null; });
  }

  /**
   * Clearing Localstorage of browser
   */
  private clearLocalUser(): void {
    this.store.dispatch(new ResetCategories());
    this.store.dispatch(new ResetCouple());
    this.store.dispatch(new ResetTransactions());
    this.store.dispatch(new ResetUser());

    this.token = null;
    localStorage.removeItem('oreka-token');
  }
}
