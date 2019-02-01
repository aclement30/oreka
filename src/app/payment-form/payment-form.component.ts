import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Payment } from '../models/payment.model';
import { PaymentsService } from '../services/payments.service';
import { AppState } from 'app/store';
import { UpdatePayment } from '../store/transactions.actions';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-payment-form',
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
