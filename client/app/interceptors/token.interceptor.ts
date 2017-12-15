import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/empty';

import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('oreka-token');

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(request).do((event: HttpEvent<any>) => {}, (error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const authService = this.injector.get(AuthService);
        authService.logoutUser().subscribe(() => {
          const snackBar = this.injector.get(MatSnackBar);
          const notice = snackBar.open('Vous avez été déconnecté suite à l\'expiration de la session.', 'OK', { duration: 3000 });
          notice.onAction().subscribe(() => { notice.dismiss(); });

          const router = this.injector.get(Router);
          if (router.url !== '/login') {
            router.navigate(['/login']);
          }
        });

        // REQUEST RETRY DOES NOT WORK
        // return authService.refreshAccessToken()
        //   .switchMap(() => {
        //     // Retry failed request if token refresh is successful
        //     return next.handle(request);
        //   })
        //   .catch(() => {
        //     return Observable.empty();
        //   });

        return Observable.empty();
      }

      return Observable.throw(error);
    });
  }
}
