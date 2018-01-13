import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../store/index';
import { Category } from '../models/category.model';
import { getCategories } from '../store/categories.reducer';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { Expense } from '../models/expense.model';
import { ExpensesService } from '../services/expenses.service';
import { UpdateExpense } from '../store/transactions.actions';

@Component({
  selector: 'expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})

export class ExpenseFormComponent extends TransactionFormComponent implements OnInit {
  categories$: Observable<Category[]>;
  costSplit = 50;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    protected dialog: MatDialogRef<TransactionFormComponent>,
    protected formBuilder: FormBuilder,
    protected snackBar: MatSnackBar,
    protected store: Store<AppState>,
    protected transactionsService: ExpensesService,
  ) {
    super(data, dialog, formBuilder, snackBar, store);
  }

  ngOnInit() {
    this.categories$ = this.store.select(getCategories);

    super.ngOnInit();
  }

  buildForm(transaction: Expense = null): FormGroup {
    let transactionDate = new Date();

    if (transaction) {
      const dateComponents = transaction.date.split('-').map(dc => parseInt(dc, 10));
      transactionDate = new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
    }

    return this.formBuilder.group({
      id: transaction ? transaction.id : null,
      amount: new FormControl(transaction ? transaction.amount : null, [Validators.required]),
      currency: transaction ? transaction.currency : 'CAD',
      description: transaction ? transaction.description : null,
      payerId: transaction ? transaction.payerId : this.userId,
      payerShare: transaction ? transaction.payerShare : 0,
      categoryId: transaction ? transaction.categoryId : null,
      date: new FormControl(transactionDate, [Validators.required]),
      notes: transaction ? transaction.notes : null,
    });
  }

  onCostSplitChange(value: number): void {
    this.costSplit = value;

    this.onPayerShareChange();
  }

  onPayerShareChange(): void {
    const payerShare = this.form.value.payerId === this.userId ? this.userShare : this.partnerShare;
    this.form.patchValue({ payerShare });
  }

  afterSave = (expense: Expense): void => {
    this.store.dispatch(new UpdateExpense(expense));
    const notice = this.snackBar.open('La dépense a été enregistrée', 'OK', { duration: 3000 });
    notice.onAction().subscribe(() => { notice.dismiss(); });
    this.dialog.close();
  }

  get userShare(): number {
    return +this.form.value.amount * this.costSplit / 100;
  }

  get partnerShare(): number {
    return +this.form.value.amount * (100 - this.costSplit) / 100;
  }
}
