import { Component, Input } from '@angular/core';

import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})

export class TransactionsListComponent {
  @Input() transactions: Transaction[];
}
