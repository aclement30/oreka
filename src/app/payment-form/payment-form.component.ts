import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../store/index';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { PaymentsService } from '../services/payments.service';
import { Payment } from '../models/payment.model';
import { UpdatePayment } from '../store/transactions.actions';

@Component({
  selector: 'payment-form',
  templateUrl: './payment-form.component.html',
})

export class PaymentFormComponent extends TransactionFormComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    protected dialog: MatDialogRef<TransactionFormComponent>,
    protected formBuilder: FormBuilder,
    protected snackBar: MatSnackBar,
    protected store: Store<AppState>,
    protected transactionsService: PaymentsService,
    protected translate: TranslateService,
  ) {
    super(data, dialog, formBuilder, snackBar, store);
  }

  buildForm(transaction: Payment = null): FormGroup {
    return this.formBuilder.group({
      id: transaction ? transaction.id : null,
      amount: new FormControl(transaction ? transaction.amount : null, [Validators.required]),
      currency: transaction ? transaction.currency : 'CAD',
      payerId: transaction ? transaction.payerId : this.userId,
      date: new FormControl(transaction ? transaction.date : new Date(), [Validators.required]),
      notes: transaction ? transaction.notes : null,
    });
  }

  afterSave = (payment: Payment): void => {
    this.store.dispatch(new UpdatePayment(payment));
    const notice = this.snackBar.open(this.translate.instant('paymentForm.paymentSaved'), 'OK', { duration: 3000 });
    notice.onAction().subscribe(() => { notice.dismiss(); });
    this.dialog.close();
  }
}
