import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxSaga from 'redux-saga';

import { rootSaga } from './sagas';
import { user, initialState as userInitialState } from './user/reducer';
import { auth, initialState as authInitialState } from './auth/reducer';
import { UserActionTypes } from './user/types';


export const initialState = {
    user: userInitialState,
	auth: authInitialState
}
export const sagaMiddleware = reduxSaga()

const middleware = [sagaMiddleware]

export const rootReducer = combineReducers({
    user,
	auth
})
export const store = createStore(rootReducer, {}, composeWithDevTools(applyMiddleware(...middleware)));
sagaMiddleware.run(rootSaga);

// export const action = (type: string) => store.dispatch({type})

export type AppState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;