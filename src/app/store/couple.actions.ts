import { Action } from '@ngrx/store';
import { CoupleState } from './couple.reducer';

export const SET_COUPLE = '[Couple] SET_COUPLE';
export const RESET_COUPLE = '[Couple] RESET_COUPLE';

export class SetCouple implements Action {
  readonly type = SET_COUPLE;

  constructor(public payload: CoupleState) { }
}

export class ResetCouple implements Action {
  readonly type = RESET_COUPLE;
}

export type Actions
  = SetCouple
  | ResetCouple;
