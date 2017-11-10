import { Action } from '@ngrx/store';
import { CoupleState } from './couple.reducer';

export const SET_COUPLE = '[Couple] SET_COUPLE';

export class SetCouple implements Action {
  readonly type = SET_COUPLE;

  constructor(public payload: CoupleState) { }
}

export type Actions
  = SetCouple;
