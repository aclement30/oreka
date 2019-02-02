import { Expense } from 'app/models/expense.model';
import { Payment } from 'app/models/payment.model';
import { BaseTransaction } from 'app/models/transaction.model';
import { AppState } from 'app/store/index';
import * as transactionsActions from 'app/store/transactions.actions';
import { createSelector } from 'reselect';

export interface TransactionsState {
  entities: BaseTransaction[];
}

export const initialState: TransactionsState = {
  entities: [],
};

function mergeTransactions(newTransactions: BaseTransaction[], existingTransactions: BaseTransaction[]): BaseTransaction[] {
  const transactionIds = newTransactions.map((transaction: BaseTransaction) => (transaction.id));

  return existingTransactions
  // Filter out existing transactions to be updated
    .filter((transaction: BaseTransaction) => (!transactionIds.includes(transaction.id)))
    // Append updated transactions
    .concat(newTransactions);
}

export function transactionsReducer(state = initialState, action: transactionsActions.Actions): TransactionsState {
  switch (action.type) {
    case transactionsActions.ADD_EXPENSES:
    case transactionsActions.UPDATE_EXPENSE: {
      let newTransactions = Array.isArray(action.payload) ? action.payload : [action.payload];
      newTransactions = newTransactions.map((transaction: Expense) => {
        transaction.type = 'Expense';
        return transaction;
      });

      return {
        ...state,
        entities: mergeTransactions(newTransactions, state.entities),
      };
    }
    case transactionsActions.ADD_PAYMENTS:
    case transactionsActions.UPDATE_PAYMENT: {
      let newTransactions = Array.isArray(action.payload) ? action.payload : [action.payload];
      newTransactions = newTransactions.map((transaction: Payment) => {
        transaction.type = 'Payment';
        return transaction;
      });

      return {
        ...state,
        entities: mergeTransactions(newTransactions, state.entities),
      };
    }

    case transactionsActions.REMOVE_TRANSACTION:
      return {
        ...state,
        entities: state.entities
        // Filter out existing transaction to be removed
          .filter((transaction: BaseTransaction) => (transaction.id !== action.payload.id)),
      };

    case transactionsActions.RESET_TRANSACTIONS:
      return initialState;

    default: {
      return state;
    }
  }
}

export const getTransactions = (state: AppState): BaseTransaction[] => state.transactions.entities;
export const getExpenses = createSelector(getTransactions, (transactions: BaseTransaction[]): Expense[] => {
  return transactions.filter((transaction: BaseTransaction) => (transaction.type === 'Expense')) as Expense[];
});
export const getPayments = createSelector(getTransactions, (transactions: BaseTransaction[]): Payment[] => {
  return transactions.filter((transaction: BaseTransaction) => (transaction.type === 'Payment')) as Payment[];
});
