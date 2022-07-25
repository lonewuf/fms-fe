import { Reducer } from 'redux';

import { AuthActions, AuthActionTypes, AuthState } from './types';

export const initialState: AuthState = {
    auth: null,
    isAuthenticated: false,
    loading: false
};

export const auth: Reducer<AuthState, AuthActions> = (state = initialState, payload) => {
    switch (payload.type) {
        case AuthActionTypes.GOT_AUTH_DATA:
            return {
                ...state,
                auth: payload.auth,
                isAuthenticated: payload.isAuthenticated
            }
        case AuthActionTypes.CLEAR_AUTH_DATA:
            return {
                ...state,
                auth: null,
                isAuthenticated: false
            }
        default:
            return state;
    }
}