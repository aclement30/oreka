import { createSelector } from 'reselect';

import { User } from '../models/user.model';
import { AppState } from './index';
import * as coupleActions from './couple.actions';
import { getCurrentUser } from './user.reducer';

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

    case coupleActions.RESET_COUPLE:
      return initialState;

    default: {
      return state;
    }
  }
}

export const getCouple = (state: AppState): CoupleState => state.couple;
export const getCoupleMembers = createSelector(getCouple, (state: CoupleState) => state.users);
export const getPartner = createSelector(
  getCoupleMembers,
  getCurrentUser,
  (members: User[], currentUser: User) => {
    return members.filter((member: User) => (member.id !== currentUser.id))[0];
  },
);
