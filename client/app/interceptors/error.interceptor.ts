import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).catch((response: any) => {
      const ignoredStatusCodes: number[] = [400, 401, 402, 403];

      if (response instanceof HttpErrorResponse && !ignoredStatusCodes.includes(response.status)) {
        this.snackBar.open(`Une erreur est survenue (code ${response.status})`, null, {
          panelClass: 'server-error',
        });
      }

      return Observable.of(response.error);
    });
  }
}
