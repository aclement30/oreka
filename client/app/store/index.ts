import { ActionReducerMap } from '@ngrx/store';

import { categoriesReducer, CategoriesState } from './categories.reducer';
import { coupleReducer, CoupleState } from './couple.reducer';
import { userReducer, UserState } from './user.reducer';

export interface AppState {
  categories: CategoriesState;
  couple: CoupleState;
  user: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  categories: categoriesReducer,
  couple: coupleReducer,
  user: userReducer,
};
