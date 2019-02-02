import { ActionReducerMap } from '@ngrx/store';
import { categoriesReducer, CategoriesState, initialState as categoriesInitialState } from 'app/store/categories.reducer';
import { coupleReducer, CoupleState, initialState as coupleInitialState } from 'app/store/couple.reducer';
import { initialState as transactionsInitialState, transactionsReducer, TransactionsState } from 'app/store/transactions.reducer';
import { initialState as userInitialState, userReducer, UserState } from 'app/store/user.reducer';

export interface AppState {
  categories: CategoriesState;
  couple: CoupleState;
  transactions: TransactionsState;
  user: UserState;
}

export const appInitialState: AppState = {
  categories: categoriesInitialState,
  couple: coupleInitialState,
  transactions: transactionsInitialState,
  user: userInitialState,
};

export const reducers: ActionReducerMap<AppState> = {
  categories: categoriesReducer,
  couple: coupleReducer,
  transactions: transactionsReducer,
  user: userReducer,
};
