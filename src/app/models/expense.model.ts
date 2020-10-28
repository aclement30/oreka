import { Category } from './category.model';
import { BaseTransaction } from './transaction.model';

export interface Expense extends BaseTransaction {
  description: string;
  payerShare?: number;
  categoryId?: number;
  category?: Category;
}
