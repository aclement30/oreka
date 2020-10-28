import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { TransactionsService } from './transactions.service';
import { Expense } from '../models/expense.model';
import { Category } from '../models/category.model';
import { getCategories } from '../store/categories.reducer';

@Injectable()
export class ExpensesService extends TransactionsService<Expense> {
  protected path = '/expenses';

  protected _mapTransaction(transaction: Expense): Expense {
    const expense = super._mapTransaction(transaction) as Expense;

    let categories: Category[];
    this.store
      .select(getCategories)
      .pipe(
        take(1),
      )
      .subscribe((stateCategories: Category[]) =>  { categories = stateCategories; });

    if (expense.categoryId) {
      expense.category = categories.find((category: Category) => (category.id === transaction.categoryId));
    }

    return expense;
  }
}
