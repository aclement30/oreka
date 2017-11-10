import { AppState } from './index';
import * as categoryActions from './categories.actions';
import { Category } from '../models/category.model';

export interface CategoriesState {
  list: Category[];
  selected: Category;
}

export const initialState: CategoriesState = {
  list: [],
  selected: null,
};

export function categoriesReducer(state = initialState, action: categoryActions.Actions): CategoriesState {
  switch (action.type) {
    case categoryActions.SET_CATEGORIES:
      return {
        ...state,
        list: action.payload,
      };

    case categoryActions.SELECT_CATEGORY:
      return {
        ...state,
        selected: action.payload,
      };

    case categoryActions.UNSELECT_CATEGORY:
      return {
        ...state,
        selected: null,
      };

    default: {
      return state;
    }
  }
}

export const getCategories = (state: AppState): Category[] => state.categories.list;
export const getSelectedCategory = (state: AppState): Category => state.categories.selected;
