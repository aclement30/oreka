import { BaseTransaction } from './models/transaction.model';

export function sortByDateDesc(a: BaseTransaction, b: BaseTransaction) {
  return (new Date(b.date) as any) - (new Date(a.date) as any);
};

