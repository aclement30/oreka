import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NEVER, Observable, Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { AppState } from '../store';
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

  private subscriptions: Subscription = NEVER.subscribe();

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.partner$ = this.store.select(getPartner);
    this.user$ = this.store.select(getCurrentUser);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authService.logoutUser().subscribe(() => {
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }
}
