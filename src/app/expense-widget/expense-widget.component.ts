import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'app/models/category.model';
import { Expense } from 'app/models/expense.model';
import { User } from 'app/models/user.model';
import { ExpensesService } from 'app/services/expenses.service';
import { AppState } from 'app/store';
import { getCategories } from 'app/store/categories.reducer';
import { UpdateExpense } from 'app/store/transactions.actions';
import { getCurrentUser } from 'app/store/user.reducer';
import * as moment from 'moment';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-expense-widget',
  templateUrl: './expense-widget.component.html',
  styleUrls: ['./expense-widget.component.scss'],
})
export class ExpenseWidgetComponent implements OnInit, OnDestroy {
  categories: Category[];
  user: User;
  expenseForm: FormGroup;

  @ViewChild('amountField') amountFieldElement: ElementRef;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private expenseService: ExpensesService,
  ) { }

  ngOnInit() {
    this.store.select(getCurrentUser).pipe(takeUntil(this.destroyed$)).subscribe(u => this.user = u);
    this.store.select(getCategories).pipe(takeUntil(this.destroyed$)).subscribe(c => this.categories = c);

    this.expenseForm = this.fb.group({
      amount: ['', Validators.required],
      date: [new Date(), Validators.required],
      categoryId: ['', Validators.required],
      description: ['', Validators.required],
      notes: [''],
      payerShare: ['', Validators.required],
      partnerShare: ['', Validators.required],
    });

    this.expenseForm.get('amount').valueChanges.subscribe(this.setShares);
    this.expenseForm.get('payerShare').valueChanges.subscribe(this.setPartnerShare);
    this.expenseForm.get('partnerShare').valueChanges.subscribe(this.setPayerShare);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  resetForm() {
    this.expenseForm.reset({ date: moment(this.expenseForm.get('date').value).toDate() });
  }

  setShares = (amount) => {
    const share = Math.round((amount / 2.0) * 100) / 100;
    const rest = amount - share;

    this.expenseForm.get('payerShare').setValue(share, { emitEvent: false });
    this.expenseForm.get('partnerShare').setValue(rest, { emitEvent: false });
  }

  setPayerShare = (share) => {
    const amount = this.expenseForm.get('amount').value;
    const rest = amount - share;
    this.expenseForm.get('payerShare').setValue(rest, { emitEvent: false });
  }

  setPartnerShare = (share) => {
    const amount = this.expenseForm.get('amount').value;
    const rest = amount - share;
    this.expenseForm.get('partnerShare').setValue(rest, { emitEvent: false });
  }

  submit() {
    if (!this.expenseForm.valid) {
      return;
    }

    const exp: Expense = {
      id: null,
      amount: this.expenseForm.get('amount').value,
      date: moment(this.expenseForm.get('date').value).format(),
      description: this.expenseForm.get('description').value,
      notes: this.expenseForm.get('notes').value,
      categoryId: this.expenseForm.get('categoryId').value,
      payerId: this.user.id,
      payerShare: this.expenseForm.get('payerShare').value,
    };

    this.expenseService.save(exp).subscribe((expense) => {
      this.store.dispatch(new UpdateExpense(expense));
      this.resetForm();
      this.amountFieldElement.nativeElement.focus();

      const notice = this.snackBar.open(this.translate.instant('expenseForm.expenseSaved'), 'OK', { duration: 3000 });
      notice.onAction().subscribe(() => { notice.dismiss(); });
    });
  }
}
