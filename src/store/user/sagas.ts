import { all, call, put, takeLatest } from "redux-saga/effects";
import { GotUserAction, User, UserActionTypes } from "./types";

// watcher
export function* getUser () {
	yield takeLatest(UserActionTypes.GET_USER_DATA, getUserAsync)
}

// workers
function* getUserAsync(actions) {
	// const response = yield call(slab_api, `/users/${actions.id}`,
	// { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
	// const decrypted = JSON.parse(cryptor.decrypt(response.data.cypher))
	// const appleIdEncoded = encodeURIComponent(decrypted.data.appleId);
	// const getAppSpecificPassword = yield call(automation_api, `data/appleuser?request=${appleIdEncoded}`)
	// const getAppSpecificPasswordDecrypted = JSON.parse(cryptor.decrypt(getAppSpecificPassword.data.cypher))
	// if (!response.data.error) {
		const data: GotUserAction = {
			type: UserActionTypes.GOT_USER_DATA,
			// user: {...decrypted.data, hasAppSpecificPass: getAppSpecificPasswordDecrypted.appSpecificPass ? true : false}
			user: {} as User
		}
		yield put(data)
	// }
}

export function* sagas() {
	yield all([call(getUser)])
}