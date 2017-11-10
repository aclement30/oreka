import { Routes, RouterModule} from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

import { Gatekeeper } from './gatekeeper';

export const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [Gatekeeper] },
  { path: 'login', component: LoginComponent, canActivate: [Gatekeeper] },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
];

export const AppRouterProvider = RouterModule.forRoot(appRoutes, { enableTracing: true });
