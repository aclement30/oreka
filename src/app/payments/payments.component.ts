import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { PaymentsService } from '../services/payments.service';
import { Payment } from '../models/payment.model';
import { AddPayments, RemoveTransaction } from '../store/transactions.actions';
import { AppState } from '../store/index';
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

  private _page = 1;
  private _pageLimit = 50;

  constructor(
    public dialog: MatDialog,
    private paymentsService: PaymentsService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.payments$ = this.store.select(getPayments).map((payments: Payment[]) => {
      return payments.sort(sortByDateDesc);
    });

    this._fetchTransactions();
  }

  onScroll() {
    if (this.lastPageReached) {
      return;
    }

    this._page++;
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
      .query({ page: this._page, limit: this._pageLimit })
      .subscribe((payments: Payment[]) => {
        if (!payments.length || payments.length < this._pageLimit) {
          this.lastPageReached = true;
        }

        this.loading = false;

        this.store.dispatch(new AddPayments(payments));
      });
  }
}
