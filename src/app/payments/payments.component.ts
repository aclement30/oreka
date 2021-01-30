import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Payment } from '../models/payment.model';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { PaymentsService } from '../services/payments.service';
import { AppState } from 'app/store';
import { AddPayments, RemoveTransaction } from '../store/transactions.actions';
import { getPayments } from '../store/transactions.reducer';
import { sortByDateDesc } from '../utils';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
})

export class PaymentsComponent implements OnInit {
  payments$: Observable<Payment[]>;
  lastPageReached = false;
  loading = false;

  private page = 1;
  private pageLimit = 50;

  constructor(
    public dialog: MatDialog,
    private paymentsService: PaymentsService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.payments$ = this.store.select(getPayments).pipe(map((payments: Payment[]) => (payments.sort(sortByDateDesc))));

    this._fetchTransactions();
  }

  onScroll(): void {
    if (this.lastPageReached) {
      return;
    }

    this.page++;
    this._fetchTransactions();
  }

  addPayment(): void {
    this.dialog.open(PaymentFormComponent, { width: '500px', height: '320px' });
  }

  removePayment(payment: Payment): void {
    this.paymentsService.remove(payment).subscribe(() => {
      this.store.dispatch(new RemoveTransaction(payment));

      const notice = this.snackBar.open(this.translate.instant('payments.paymentDeleted'), this.translate.instant('common.actions.cancel'));
      notice.onAction().subscribe(() => {
        this.restorePayment(payment);
      });
    });
  }

  restorePayment(payment: Payment): void {
    this.paymentsService.restore(payment).subscribe((updatedPayment: Payment) => {
      this.store.dispatch(new AddPayments([payment]));
    });
  }

  private _fetchTransactions(): void {
    this.loading = true;

    this.paymentsService
      .query({ page: this.page, limit: this.pageLimit })
      .subscribe((payments: Payment[]) => {
        if (!payments.length || payments.length < this.pageLimit) {
          this.lastPageReached = true;
        }

        this.loading = false;

        this.store.dispatch(new AddPayments(payments));
      });
  }
}
