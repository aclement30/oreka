import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../store/index';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpensesService } from '../services/expenses.service';
import { Expense } from '../models/expense.model';
import { User } from '../models/user.model';
import { getPartner } from '../store/couple.reducer';
import { getCurrentUser } from '../store/user.reducer';
import { Payment } from '../models/payment.model';
import { PaymentsService } from '../services/payments.service';
import { AddExpenses, AddPayments } from '../store/transactions.actions';
import { getExpenses, getPayments } from '../store/transactions.reducer';
import { sortByDateDesc } from '../utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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

  ngOnInit() {
    this.partner$ = this.store.select(getPartner);
    this.user$ = this.store.select(getCurrentUser);

    this.expenses$ = this.store.select(getExpenses).map((expenses: Expense[]) => {
      return expenses.sort(sortByDateDesc).slice(0, 6);
    });

    this.payments$ = this.store.select(getPayments).map((payments: Payment[]) => {
      return payments.sort(sortByDateDesc).slice(0, 3);
    });

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

  addExpense() {
    this.dialog.open(ExpenseFormComponent, { width: '500px', height: '500px' });
  }
}
