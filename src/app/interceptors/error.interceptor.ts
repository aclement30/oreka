import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private snackBar: MatSnackBar,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).catch((response: any) => {
      const ignoredStatusCodes: number[] = [400, 401, 402, 403];

      if (response instanceof HttpErrorResponse && !ignoredStatusCodes.includes(response.status)) {
        const translate = this.injector.get(TranslateService);
        this.snackBar.open(translate.instant('common.unknownError', { statusCode: response.status }), null, {
          panelClass: 'server-error',
        });
      }

      return Observable.of(response.error);
    });
  }
}
