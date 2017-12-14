import { User } from './user.model';

export interface BaseTransaction {
  id: number;
  type?: 'Expense' | 'Payment';
  date: string;
  amount: number;
  currency?: string;
  notes?: string;
  created?: string;
  updated?: string;
  payerId: number;
  payer?: User;
}
