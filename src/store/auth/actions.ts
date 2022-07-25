import { GetAuthAction, AuthActionTypes } from './types';

export const getAuth = (id: string): GetAuthAction => ({ id, type: AuthActionTypes.GET_AUTH_DATA })