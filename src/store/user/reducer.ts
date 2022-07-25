import { Reducer } from 'redux';

import { UserActions, UserActionTypes, UserState } from './types';

export const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    loading: false
};

export const user: Reducer<UserState, UserActions> = (state = initialState, payload) => {
    switch (payload.type) {
        case UserActionTypes.GOT_USER_DATA:
            return {
                ...state,
                user: payload.user
            }
        default:
            return state;
    }
}