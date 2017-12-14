import { Routes, RouterModule} from '@angular/router';

import { Gatekeeper } from './services/gatekeeper';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { LoginComponent } from './login/login.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';

export const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [Gatekeeper] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [Gatekeeper] },
  { path: 'expenses/add', component: ExpenseFormComponent, canActivate: [Gatekeeper] },
  { path: 'payments', component: PaymentsComponent, canActivate: [Gatekeeper] },
  { path: 'payments/add', component: PaymentFormComponent, canActivate: [Gatekeeper] },
  { path: 'login', component: LoginComponent, canActivate: [Gatekeeper] },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
];

export const AppRouterProvider = RouterModule.forRoot(appRoutes, { enableTracing: false });
