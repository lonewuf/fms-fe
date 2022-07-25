import { all, call, put, takeLatest } from "redux-saga/effects";
import { GotAuthAction, Auth, AuthActionTypes } from "./types";

// watcher
export function* getAuth () {
	yield takeLatest(AuthActionTypes.GET_AUTH_DATA, getAuthAsync)
}

// workers
function* getAuthAsync(actions) {
	// const response = yield call(slab_api, `/Auths/${actions.id}`,
	// { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
	// const decrypted = JSON.parse(cryptor.decrypt(response.data.cypher))
	// const appleIdEncoded = encodeURIComponent(decrypted.data.appleId);
	// const getAppSpecificPassword = yield call(automation_api, `data/appleAuth?request=${appleIdEncoded}`)
	// const getAppSpecificPasswordDecrypted = JSON.parse(cryptor.decrypt(getAppSpecificPassword.data.cypher))
	// if (!response.data.error) {
		const data: GotAuthAction = {
			type: AuthActionTypes.GOT_AUTH_DATA,
			// Auth: {...decrypted.data, hasAppSpecificPass: getAppSpecificPasswordDecrypted.appSpecificPass ? true : false}
			auth: {} as Auth,
			isAuthenticated: true
		}
		yield put(data)
	// }
}

export function* sagas() {
	yield all([call(getAuth)])
}