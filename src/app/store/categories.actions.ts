import { Action } from '@ngrx/store';
import { Category } from '../models/category.model';

export const SET_CATEGORIES = '[Categories] SET_CATEGORIES';
export const SELECT_CATEGORY = '[Categories] SELECT_CATEGORY';
export const UNSELECT_CATEGORY = '[Categories] UNSELECT_CATEGORY';
export const RESET_CATEGORIES = '[Categories] RESET_CATEGORIES';

export class SetCategories implements Action {
  readonly type = SET_CATEGORIES;

  constructor(public payload: Category[]) { }
}

export class SelectCategory implements Action {
  readonly type = SELECT_CATEGORY;

  constructor(public payload: Category) { }
}

export class UnselectCategory implements Action {
  readonly type = UNSELECT_CATEGORY;
}

export class ResetCategories implements Action {
  readonly type = RESET_CATEGORIES;
}

export type Actions
  = SetCategories
  | SelectCategory
  | UnselectCategory
  | ResetCategories;
