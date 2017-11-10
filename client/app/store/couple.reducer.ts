import { createSelector } from 'reselect';

import { User } from '../models/user.model';
import { AppState } from './index';
import * as coupleActions from './couple.actions';

export interface CoupleState {
  users: User[];
}

export const initialState: CoupleState = {
  users: [],
};

export function coupleReducer(state = initialState, action: coupleActions.Actions): CoupleState {
  switch (action.type) {
    case coupleActions.SET_COUPLE:
      return {
        ...action.payload
      };

    default: {
      return state;
    }
  }
}

export const getCouple = (state: AppState): CoupleState => state.couple;
export const getUsers = createSelector(getCouple, (state: CoupleState) => state.users);
