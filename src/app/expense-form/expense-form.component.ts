import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'app/models/category.model';
import { Expense } from 'app/models/expense.model';
import { ExpensesService } from 'app/services/expenses.service';
import { AppState } from 'app/store';
import { getCategories } from 'app/store/categories.reducer';
import { UpdateExpense } from 'app/store/transactions.actions';
import { TransactionFormComponent } from 'app/transaction-form/transaction-form.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})

export class ExpenseFormComponent extends TransactionFormComponent {
  categories$: Observable<Category[]>;
  costSplit = 50;

  filteredDescriptionOptions: string[];
  descriptionOptions: { [name: string]: number } = {
    'Amazon': 4,
    'BC Hydro': 2,
    'Berrymobile': 1,
    'Choices Market': 1,
    'Costco': 4,
    'Crave': 5,
    'Crosstown Liquor Store': 1,
    'Dalina': 10,
    'Doordash': 10,
    'Enerpro': 2,
    'Evo': 7,
    'Famous Foods': 1,
    'Gourmet Warehouse': 1,
    'IGA': 1,
    'Legacy Liquor Store': 1,
    'Les Amis Du Fromage': 1,
    'Loblaws': 1,
    'London Drugs': 4,
    'Matchstick': 10,
    'Nesters Market': 1,
    'Netflix': 5,
    'Skipper Otto': 1,
    'Skipthedishes': 10,
    'Square One Insurance': 4,
    'Tacofino': 10,
    'Telus': 3,
    'Terra Breads': 1,
    'T&T': 1,
    'Urban Fare': 1,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    protected dialog: MatDialogRef<TransactionFormComponent>,
    protected formBuilder: FormBuilder,
    protected snackBar: MatSnackBar,
    protected store: Store<AppState>,
    protected transactionsService: ExpensesService,
    protected translate: TranslateService,
  ) {
    super(data, dialog, formBuilder, snackBar, store);
  }

  ngOnInit(): void {
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

  onDescriptionChange(event): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredDescriptionOptions = Object.keys(this.descriptionOptions).filter(option => option.toLowerCase().startsWith(filterValue));
  }

  onDescriptionSelected(event: MatAutocompleteSelectedEvent): void {
    const { value } = event.option;

    const categoryId = this.descriptionOptions[value];

    if (categoryId) {
      this.form.patchValue({ categoryId });
    }
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
    const notice = this.snackBar.open(this.translate.instant('expenseForm.expenseSaved'), 'OK', { duration: 3000 });
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
