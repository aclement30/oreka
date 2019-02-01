import { ActionReducerMap } from '@ngrx/store';

import { categoriesReducer, CategoriesState } from './categories.reducer';
import { coupleReducer, CoupleState } from './couple.reducer';
import { transactionsReducer, TransactionsState } from './transactions.reducer';
import { userReducer, UserState } from './user.reducer';

export interface AppState {
  categories: CategoriesState;
  couple: CoupleState;
  transactions: TransactionsState;
  user: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  categories: categoriesReducer,
  couple: coupleReducer,
  transactions: transactionsReducer,
  user: userReducer,
};
