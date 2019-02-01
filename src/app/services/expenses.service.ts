import { Injectable } from '@angular/core';
import { Category } from 'app/models/category.model';
import { Expense } from 'app/models/expense.model';
import { TransactionsService } from 'app/services/transactions.service';
import { getCategories } from 'app/store/categories.reducer';
import { take } from 'rxjs/operators';

@Injectable()
export class ExpensesService extends TransactionsService<Expense> {
  protected path = '/expenses';

  protected _mapTransaction(transaction: Expense): Expense {
    const expense = super._mapTransaction(transaction) as Expense;

    let categories: Category[];
    this.store.select(getCategories).pipe(take(1)).subscribe((stateCategories: Category[]) => { categories = stateCategories; });

    if (expense.categoryId) {
      expense.category = categories.find((category: Category) => (category.id === transaction.categoryId));
    }

    return expense;
  }
}
