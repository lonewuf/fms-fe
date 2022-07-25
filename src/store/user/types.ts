import { Action } from 'redux'

export interface UserState {
	user: User | null
	isAuthenticated: boolean
	loading: boolean
}

export enum UserActionTypes {
    // Sagas
    GET_USER_DATA = 'GET_USER_DATA',
    VALIDATE_USER = 'VALIDATE_USER',
    
    // Reducer
    GOT_USER_DATA = 'GOT_USER_DATA',
    VALIDATED_USER = 'VALIDATED_USER',
    LOADING_USER = 'LOADING_USER',
}

export enum UserType {
	STUDENT = 'STUDENT',
	ADMIN = 'ADMIN'
}

export interface User {
	_id: string
	email: string
	firstName: string
	lastName: string
	studentNumber: string
	password: string
	userType: UserType
}

export interface GetUserAction extends Action {
	type: typeof UserActionTypes.GET_USER_DATA,
	id: string
}

export interface GotUserAction extends Action {
	type: typeof UserActionTypes.GOT_USER_DATA,
	user: User
}

export type UserActions = GetUserAction | GotUserAction