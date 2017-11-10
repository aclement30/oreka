import { Component } from '@angular/core';

import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  public transactions: Transaction[] = [
    { id: 1, date: '2017-10-01', amount: 27.00, description: 'Hydro-Québec', category: 'Électricité', paidBy: 1 } as Transaction,
    { id: 2, date: '2017-10-09', amount: 32.00, description: 'Metro', category: 'Épicerie', paidBy: 1 } as Transaction,
  ];
}
