import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ExpenseFormComponent } from 'app/expense-form/expense-form.component';
import { ImportComponent } from 'app/import/import.component';
import { Expense } from 'app/models/expense.model';
import { Payment } from 'app/models/payment.model';
import { User } from 'app/models/user.model';
import { ExpensesService } from 'app/services/expenses.service';
import { PaymentsService } from 'app/services/payments.service';
import { AppState } from 'app/store';
import { getPartner } from 'app/store/couple.reducer';
import { AddExpenses, AddPayments } from 'app/store/transactions.actions';
import { getExpenses, getPayments } from 'app/store/transactions.reducer';
import { getCurrentUser } from 'app/store/user.reducer';
import { sortByDateDesc } from 'app/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  expenses$: Observable<Expense[]>;
  payments$: Observable<Payment[]>;
  partner$: Observable<User>;
  user$: Observable<User>;

  constructor(
    public dialog: MatDialog,
    private expensesService: ExpensesService,
    private paymentsService: PaymentsService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.partner$ = this.store.select(getPartner);
    this.user$ = this.store.select(getCurrentUser);

    this.expenses$ = this.store
      .select(getExpenses)
      .pipe(map((expenses: Expense[]) => (expenses.sort(sortByDateDesc).slice(0, 6))));

    this.payments$ = this.store
      .select(getPayments).pipe(map((payments: Payment[]) => (payments.sort(sortByDateDesc).slice(0, 3))));

    this.expensesService
      .query({ limit: 6 })
      .subscribe((expenses: Expense[]) => {
        this.store.dispatch(new AddExpenses(expenses));
      });

    this.paymentsService
      .query({ limit: 3 })
      .subscribe((payments: Payment[]) => {
        this.store.dispatch(new AddPayments(payments));
      });
  }

  addExpense(): void {
    this.dialog.open(ExpenseFormComponent, { width: '500px', height: '500px' });
  }

  importFromFile(): void {
    this.dialog.open(ImportComponent, { hasBackdrop: true, disableClose: true, width: '95%', height: '95%' });
  }
}
