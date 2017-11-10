import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

// Angular Material
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';

import { AppRouterProvider } from './routes';
import { reducers } from './store/index';

// Services
import { AuthService } from './auth.service';
import { Gatekeeper } from './gatekeeper';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GoogleSigninComponent } from './google-signin/google-signin.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GoogleSigninComponent,
    LoginComponent,
    SidebarComponent,
    TransactionsListComponent,
  ],
  imports: [
    AppRouterProvider,
    BrowserAnimationsModule,
    BrowserModule,
    MatListModule,
    MatSidenavModule,
    MatTableModule,
    StoreModule.forRoot(reducers, {
      initialState: {
        couple: {
          users: [
            { id: 1, name: 'Alexandre Clément', email: 'a.clement30@gmail.com', initials: 'AC', token: null },
            { id: 2, name: 'Johann Boutet', email: 'johannboutet@gmail.com', initials: 'JB', token: null },
          ],
        }
      }
    }),
  ],
  providers: [
    AuthService,
    Gatekeeper,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
