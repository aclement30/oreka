import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

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
    private dialog: MatDialog,
    private translate: TranslateService,
  ) {}

  edit(transaction: BaseTransaction): void {
    if (this.type === 'expenses') {
      this.dialog.open(ExpenseFormComponent, { width: '500px', height: '500px', data: { transaction } });
    } else {
      this.dialog.open(PaymentFormComponent, { width: '500px', height: '500px', data: { transaction } });
    }
  }

  remove(transaction: BaseTransaction): void {
    if (confirm(this.translate.instant('common.askRemoveTransaction'))) {
      this.onRemove.emit(transaction);
    }
  }
}