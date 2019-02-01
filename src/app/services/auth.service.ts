import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, forkJoin, Observable, of, throwError as observableThrowError } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { API_ENDPOINT } from '../config';
import { User } from '../models/user.model';
import { ResetCategories } from '../store/categories.actions';
import { ResetCouple, SetCouple } from '../store/couple.actions';
import { AppState } from '../store/index';
import { ResetTransactions } from '../store/transactions.actions';
import { ResetUser, SetCurrentUser } from '../store/user.actions';
import { CategoriesService } from './categories.service';

@Injectable()
export class AuthService {
  redirectUrl: string;

  userAuthenticated$ = new BehaviorSubject<boolean>(null);
  protected tokenRefreshRequest$: Observable<string>;
  protected token: string;

  constructor(
    protected categoriesService: CategoriesService,
    protected http: HttpClient,
    protected router: Router,
    protected store: Store<AppState>,
  ) {
    this.userAuthenticated$.pipe(filter(isAuthenticated => (isAuthenticated === false))).subscribe(this.onUserDeauthenticated);
  }

  initUser(): Observable<boolean> {
    const accessToken = localStorage.getItem('oreka-token');
    if (accessToken) {
      this.token = accessToken;
      this.userAuthenticated$.next(true);
      return of(true);
    }

    return of(false);
  }

  authenticateUser(): Observable<any> {
    return observableThrowError('Error: not implemented');
  }

  logoutUser(): Observable<any> {
    this.token = null;
    return of(this.clearLocalUser());
  }

  // DOES NOT WORK
  // refreshAccessToken(): Observable<string> {
  //   // Skip is token refresh process is already ongoing
  //   if (this.tokenRefreshRequest$) {
  //     return this.tokenRefreshRequest$;
  //   }
  //
  //   const googleToken = this.googleAuthService.userAuthenticated$.getValue();
  //   if (googleToken === null) {
  //     return this.tokenRefreshRequest$ = this.googleAuthService.userAuthenticated$
  //       .filter((token) => (token !== null))
  //       .flatMap((token: string | boolean): Observable<string> => {
  //         return this._exchangeGoogleAuthToken(token);
  //       });
  //   }
  //
  //   return this._exchangeGoogleAuthToken(googleToken);
  // }

  loadBaseData(): Observable<any> {
    return forkJoin([
      this.fetchUser(),
      this.getCoupleMembers(),
      this.categoriesService.query(),
    ]);
  }

  fetchUser(): Observable<User> {
    return this.http.get<User>(API_ENDPOINT + '/users/profile').pipe(map((user: User): User => {
      this.store.dispatch(new SetCurrentUser(user));
      return user;
    }));
  }

  getCoupleMembers(): Observable<User[]> {
    return this.http.get<User[]>(API_ENDPOINT + '/couples/members').pipe(map((coupleMembers: User[]): User[] => {
      coupleMembers[0].color = '#7761a7';
      coupleMembers[1].color = '#3d566d';

      this.store.dispatch(new SetCouple({ users: coupleMembers }));

      return coupleMembers;
    }));
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  // private _exchangeGoogleAuthToken(googleToken: string | boolean): Observable<string> {
  //   if (googleToken === false) {
  //     return Observable.throw('Google user is not authenticated');
  //   }
  //
  //   return this.tokenRefreshRequest$ = this.requestAccessToken(googleToken as string)
  //     .do(() => { this.tokenRefreshRequest$ = null; });
  // }

  /**
   * Clearing Localstorage of browser
   */
  protected clearLocalUser(): void {
    this.store.dispatch(new ResetCategories());
    this.store.dispatch(new ResetCouple());
    this.store.dispatch(new ResetTransactions());
    this.store.dispatch(new ResetUser());

    this.token = null;
    localStorage.removeItem('oreka-token');
  }

  private onUserDeauthenticated = (): void => {
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }
}
