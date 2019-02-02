import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseFormComponent } from 'app/expense-form/expense-form.component';
import { BaseTransaction } from 'app/models/transaction.model';
import { PaymentFormComponent } from 'app/payment-form/payment-form.component';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})

export class TransactionsListComponent {
  @Input() type: 'expenses' | 'payments' = 'expenses';
  @Input() editable = true;
  @Input() transactions: BaseTransaction[];

  @Output() remove = new EventEmitter<BaseTransaction>();

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
  ) {}

  edit(transaction: BaseTransaction) {
    if (this.type === 'expenses') {
      this.dialog.open(ExpenseFormComponent, { width: '500px', height: '500px', data: { transaction } });
    } else {
      this.dialog.open(PaymentFormComponent, { width: '500px', height: '500px', data: { transaction } });
    }
  }

  doRemove(transaction: BaseTransaction) {
    if (confirm(this.translate.instant('common.askRemoveTransaction'))) {
      this.remove.emit(transaction);
    }
  }
}
