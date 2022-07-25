import { Action } from 'redux'

export interface AuthState {
	auth: Auth | null
	isAuthenticated: boolean
	loading: boolean
}

export enum AuthActionTypes {
    // Sagas
    GET_AUTH_DATA = 'GET_AUTH_DATA',
    VALIDATE_AUTH = 'VALIDATE_AUTH',
	CLEAR_AUTH_DATA = 'CLEAR_AUTH_DATA',
    
    // Reducer
    GOT_AUTH_DATA = 'GOT_AUTH_DATA',
    VALIDATED_AUTH = 'VALIDATED_AUTH',
    LOADING_AUTH = 'LOADING_AUTH',
}

export enum UserType {
	STUDENT = 'STUDENT',
	ADMIN = 'ADMIN'
}

export interface Auth {
	id: string	
	name: string
	userType: UserType
}

export interface GetAuthAction extends Action {
	type: typeof AuthActionTypes.GET_AUTH_DATA,
	id: string
}

export interface GotAuthAction extends Action {
	type: typeof AuthActionTypes.GOT_AUTH_DATA,
	auth: Auth,
	isAuthenticated: boolean
}

export interface ClearAuthAction extends Action {
	type: typeof AuthActionTypes.CLEAR_AUTH_DATA,
}

export type AuthActions = GetAuthAction | GotAuthAction | ClearAuthAction