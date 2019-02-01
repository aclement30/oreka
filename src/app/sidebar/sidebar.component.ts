import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { NEVER, Observable, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { getPartner } from '../store/couple.reducer';
import { getCurrentUser } from '../store/user.reducer';

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

  ngOnInit() {
    this.partner$ = this.store.select(getPartner);
    this.user$ = this.store.select(getCurrentUser);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout() {
    this.authService.logoutUser().subscribe(() => {
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }
}
