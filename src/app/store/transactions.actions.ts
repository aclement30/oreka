import { Action } from '@ngrx/store';
import { BaseTransaction } from '../models/transaction.model';
import { Expense } from '../models/expense.model';
import { Payment } from '../models/payment.model';

export const ADD_EXPENSES = '[Transactions] ADD_EXPENSES';
export const ADD_PAYMENTS = '[Transactions] ADD_PAYMENTS';
export const UPDATE_EXPENSE = '[Transactions] UPDATE_EXPENSE';
export const UPDATE_PAYMENT = '[Transactions] UPDATE_PAYMENT';
export const REMOVE_TRANSACTION = '[Transactions] REMOVE_TRANSACTION';
export const RESET_TRANSACTIONS = '[Transactions] RESET_TRANSACTIONS';

export class AddExpenses implements Action {
  readonly type = ADD_EXPENSES;

  constructor(public payload: Expense[]) { }
}

export class AddPayments implements Action {
  readonly type = ADD_PAYMENTS;

  constructor(public payload: Payment[]) { }
}

export class UpdateExpense implements Action {
  readonly type = UPDATE_EXPENSE;

  constructor(public payload: Expense) { }
}

export class UpdatePayment implements Action {
  readonly type = UPDATE_PAYMENT;

  constructor(public payload: Payment) { }
}

export class RemoveTransaction implements Action {
  readonly type = REMOVE_TRANSACTION;

  constructor(public payload: BaseTransaction) { }
}

export class ResetTransactions implements Action {
  readonly type = RESET_TRANSACTIONS;
}


export type Actions
  = AddExpenses
  | AddPayments
  | UpdateExpense
  | UpdatePayment
  | RemoveTransaction
  | ResetTransactions;
