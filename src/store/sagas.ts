import { all, call } from 'redux-saga/effects';
import { sagas as userSagas } from './user/sagas'

export function* rootSaga() {
    yield all([call(userSagas)]);
}