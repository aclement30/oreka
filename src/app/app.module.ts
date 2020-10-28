import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'hammerjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core'
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatSliderModule } from '@angular/material/slider';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppRouterProvider } from './routes';
import { reducers } from './store';

// Services
import { AuthService } from './services/auth.service';
import { CategoriesService } from './services/categories.service';
import { ExpensesService } from './services/expenses.service';
import { Gatekeeper } from './services/gatekeeper';
import { GoogleAuthService } from './services/google-auth.service';
import { PaymentsService } from './services/payments.service';

// Components
import { AppComponent } from './app.component';
import { AvatarComponent } from './avatar/avatar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { LoginComponent } from './login/login.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentsComponent } from './payments/payments.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AvatarComponent,
    DashboardComponent,
    ExpenseFormComponent,
    ExpensesComponent,
    LoginComponent,
    PaymentFormComponent,
    PaymentsComponent,
    SidebarComponent,
    TransactionsListComponent,
  ],
  entryComponents: [
    ExpenseFormComponent,
    PaymentFormComponent,
  ],
  imports: [
    AppRouterProvider,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    InfiniteScrollModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatNativeDateModule,
    MatSliderModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {
      initialState: {}
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    {
      provide: AuthService,
      useClass: GoogleAuthService,
    },
    CategoriesService,
    ExpensesService,
    Gatekeeper,
    PaymentsService,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-CH' },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
