import { User } from '../models/user.model';
import { AppState } from './index';
import * as userActions from './user.actions';

export interface UserState {
  currentUser: User;
}

export const initialState: UserState = {
  currentUser: null,
};

export function userReducer(state = initialState, action: userActions.Actions): UserState {
  switch (action.type) {
    case userActions.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      };

    case userActions.RESET_USER:
      return initialState;

    default: {
      return state;
    }
  }
}

export const getCurrentUser = (state: AppState): User => state.user.currentUser;
