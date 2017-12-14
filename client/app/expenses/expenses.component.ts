import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpensesService } from '../services/expenses.service';
import { Expense } from '../models/expense.model';
import { AddExpenses, RemoveTransaction } from '../store/transactions.actions';
import { AppState } from '../store/index';
import { getExpenses } from '../store/transactions.reducer';
import { sortByDateDesc } from '../utils';

@Component({
  selector: 'expenses',
  templateUrl: './expenses.component.html',
})

export class ExpensesComponent implements OnInit {
  expenses$: Observable<Expense[]>;
  lastPageReached = false;
  loading = false;

  private _page = 1;
  private _pageLimit = 50;

  constructor(
    public dialog: MatDialog,
    private expensesService: ExpensesService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.expenses$ = this.store.select(getExpenses).map((expenses: Expense[]) => {
      return expenses.sort(sortByDateDesc);
    });

    this.fetchTransactions();
  }

  onScroll() {
    if (this.lastPageReached) {
      return;
    }

    this._page++;
    this.fetchTransactions();
  }

  addExpense() {
    this.dialog.open(ExpenseFormComponent, { width: '500px', height: '500px' });
  }

  removeExpense(expense: Expense): void {
    this.expensesService.remove(expense).subscribe(() => {
      this.store.dispatch(new RemoveTransaction(expense));

      const notice = this.snackBar.open('La dépense a été supprimée', 'Annuler');
      notice.onAction().subscribe(() => {
        this.restoreExpense(expense);
      });
    });
  }

  restoreExpense = (expense: Expense): void => {
    this.expensesService.restore(expense).subscribe((updatedExpense: Expense) => {
      this.store.dispatch(new AddExpenses([updatedExpense]));
    });
  }

  private fetchTransactions(): void {
    this.loading = true;

    this.expensesService
      .query({ page: this._page, limit: this._pageLimit })
      .subscribe((expenses: Expense[]) => {
        if (!expenses.length || expenses.length < this._pageLimit) {
          this.lastPageReached = true;
        }

        this.loading = false;

        this.store.dispatch(new AddExpenses(expenses));
      });
  }
}
