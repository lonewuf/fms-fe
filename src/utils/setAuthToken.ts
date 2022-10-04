import axios from 'axios'

const setAuthToken = (token: string) => {
	if (token) {
		token = token.split(' ')[1]
		axios.defaults.headers.common['Authorization'] = token.split(' ')[1]
	} else {
		delete axios.defaults.headers.common['Authorization']
	}
}

export default setAuthToken