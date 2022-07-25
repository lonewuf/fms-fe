import { GetUserAction, UserActionTypes } from './types';

export const getUser = (id: string): GetUserAction => ({ id, type: UserActionTypes.GET_USER_DATA })