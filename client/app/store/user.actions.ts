import { Action } from '@ngrx/store';

import { User } from '../models/user.model';

export const SET_CURRENT_USER = '[User] SET_CURRENT_USER';

export class SetCurrentUser implements Action {
  readonly type = SET_CURRENT_USER;

  constructor(public payload: User) { }
}

export type Actions
  = SetCurrentUser;
