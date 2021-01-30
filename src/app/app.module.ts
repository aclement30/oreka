import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from 'app/app.component';
import { AvatarComponent } from 'app/avatar/avatar.component';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { ExpenseFormComponent } from 'app/expense-form/expense-form.component';
import { ExpenseWidgetComponent } from 'app/expense-widget/expense-widget.component';
import { ExpensesComponent } from 'app/expenses/expenses.component';
import { ImportComponent } from 'app/import/import.component';
import { ErrorInterceptor } from 'app/interceptors/error.interceptor';
import { TokenInterceptor } from 'app/interceptors/token.interceptor';
import { LoginComponent } from 'app/login/login.component';
import { PaymentFormComponent } from 'app/payment-form/payment-form.component';
import { PaymentsComponent } from 'app/payments/payments.component';
import { AppRouterProvider } from 'app/routes';
import { AuthService } from 'app/services/auth.service';
import { CategoriesService } from 'app/services/categories.service';
import { ExpensesService } from 'app/services/expenses.service';
import { Gatekeeper } from 'app/services/gatekeeper';
import { GoogleAuthService } from 'app/services/google-auth.service';
import { PaymentsService } from 'app/services/payments.service';
import { SidebarComponent } from 'app/sidebar/sidebar.component';
import { appInitialState, reducers } from 'app/store';
import { TransactionsListComponent } from 'app/transactions-list/transactions-list.component';
import 'hammerjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
    ImportComponent,
    ExpenseWidgetComponent,
  ],
  entryComponents: [
    ExpenseFormComponent,
    PaymentFormComponent,
    ImportComponent,
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
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    MatSliderModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot(reducers, { initialState: appInitialState }),
    StoreDevtoolsModule.instrument({
      maxAge: 10,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
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
  bootstrap: [AppComponent],
})
export class AppModule {}
