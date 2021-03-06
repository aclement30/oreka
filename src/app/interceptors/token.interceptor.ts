import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('oreka-token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {}, (error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          const authService = this.injector.get(AuthService);
          authService.logoutUser().subscribe();

          // REQUEST RETRY DOES NOT WORK
          // return authService.refreshAccessToken()
          //   .switchMap(() => {
          //     // Retry failed request if token refresh is successful
          //     return next.handle(request);
          //   })
          //   .catch(() => {
          //     return Observable.empty();
          //   });

          return EMPTY;
        }

        return throwError(error);
      }),
    );
  }
}
