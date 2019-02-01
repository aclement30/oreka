import { Injectable } from '@angular/core';

import { TransactionsService } from './transactions.service';
import { Payment } from '../models/payment.model';

@Injectable()
export class PaymentsService extends TransactionsService<Payment> {
  protected path = '/payments';
}
