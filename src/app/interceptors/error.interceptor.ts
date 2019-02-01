import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private snackBar: MatSnackBar,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((response: any) => {
      const ignoredStatusCodes: number[] = [400, 401, 402, 403];

      if (response instanceof HttpErrorResponse && !ignoredStatusCodes.includes(response.status)) {
        const translate = this.injector.get(TranslateService);
        this.snackBar.open(translate.instant('common.unknownError', { statusCode: response.status }), null, {
          panelClass: 'server-error',
        });
      }

      return of(response.error);
    }));
  }
}
