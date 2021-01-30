import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseFormComponent } from 'app/expense-form/expense-form.component';
import { BaseTransaction } from 'app/models/transaction.model';
import { PaymentFormComponent } from 'app/payment-form/payment-form.component';
import { Expense } from '../models/expense.model'
import { Payment } from '../models/payment.model'

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})

export class TransactionsListComponent {
  @Input() type: 'expenses' | 'payments' = 'expenses';
  @Input() editable = true;
  @Input() transactions: Array<Expense | Payment>;

  @Output() remove = new EventEmitter<BaseTransaction>();

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

  doRemove(transaction: BaseTransaction): void {
    if (confirm(this.translate.instant('common.askRemoveTransaction'))) {
      this.remove.emit(transaction);
    }
  }
}
