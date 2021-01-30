import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseFormComponent } from 'app/expense-form/expense-form.component';
import { ImportComponent } from 'app/import/import.component';
import { Expense } from 'app/models/expense.model';
import { ExpensesService } from 'app/services/expenses.service';
import { AppState } from 'app/store';
import { AddExpenses, RemoveTransaction } from 'app/store/transactions.actions';
import { getExpenses } from 'app/store/transactions.reducer';
import { sortByDateDesc } from 'app/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
})

export class ExpensesComponent implements OnInit {
  expenses$: Observable<Expense[]>;
  lastPageReached = false;
  loading = false;

  private page = 1;
  private pageLimit = 50;

  constructor(
    public dialog: MatDialog,
    private expensesService: ExpensesService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.expenses$ = this.store
      .select(getExpenses)
      .pipe(map((expenses: Expense[]) => (expenses.sort(sortByDateDesc))));

    this.fetchTransactions();
  }

  onScroll(): void {
    if (this.lastPageReached) {
      return;
    }

    this.page++;
    this.fetchTransactions();
  }

  addExpense(): void {
    this.dialog.open(ExpenseFormComponent, { width: '500px', height: '500px' });
  }

  importFromFile(): void {
    this.dialog.open(ImportComponent, { hasBackdrop: true, disableClose: true, width: '95%', height: '95%' });
  }

  removeExpense(expense: Expense): void {
    this.expensesService.remove(expense).subscribe(() => {
      this.store.dispatch(new RemoveTransaction(expense));

      const notice = this.snackBar.open(this.translate.instant('expenses.expenseDeleted'), this.translate.instant('common.actions.cancel'));
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
      .query({ page: this.page, limit: this.pageLimit })
      .subscribe((expenses: Expense[]) => {
        if (!expenses.length || expenses.length < this.pageLimit) {
          this.lastPageReached = true;
        }

        this.loading = false;
        this.store.dispatch(new AddExpenses(expenses));
      });
  }
}
