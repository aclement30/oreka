import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/never';

import { AuthService } from '../services/auth.service';
import { AppState } from '../store/index';
import { getCurrentUser } from '../store/user.reducer';
import { getPartner } from '../store/couple.reducer';
import { User } from '../models/user.model';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})

export class SidebarComponent implements OnInit, OnDestroy {
  partner$: Observable<User>;
  user$: Observable<User>;

  private subscriptions: Subscription = Observable.never().subscribe();

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.partner$ = this.store.select(getPartner);
    this.user$ = this.store.select(getCurrentUser);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout() {
    this.authService.logoutUser().subscribe();
  }
}
