import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { BaseTransaction } from '../models/transaction.model';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})

export class TransactionsListComponent {
  @Input() type: 'expenses' | 'payments' = 'expenses';
  @Input() editable = true;
  @Input() transactions: BaseTransaction[];

  @Output() onRemove = new EventEmitter<BaseTransaction>();

  constructor(
    public dialog: MatDialog,
  ) {}

  edit(transaction: BaseTransaction) {
    if (this.type === 'expenses') {
      this.dialog.open(ExpenseFormComponent, { width: '500px', height: '500px', data: { transaction } });
    } else {
      this.dialog.open(PaymentFormComponent, { width: '500px', height: '500px', data: { transaction } });
    }
  }

  remove(transaction: BaseTransaction) {
    if (confirm('Voulez-vous vraiment effacer cette transaction ?')) {
      this.onRemove.emit(transaction);
    }
  }
}
