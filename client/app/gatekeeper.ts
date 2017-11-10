import {Injectable} from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class Gatekeeper implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    if (this.authService.isAuthenticated) {
      if (url === '/login') {
        console.log('You are already logged in');
        this.router.navigate(['/dashboard']);
        return false;
      }

      return true;
    }

    if (url === '/login') { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
