export interface Transaction {
  id: number;
  date: string;
  type: 'expense' | 'payment';
  description: string;
  amount: number;
  notes?: string;
  created: string;
  updated: string;
  merchant?: string;
  category?: string;
  paidBy: number;
}
