import axios from 'axios'

const setAuthToken = (token: string) => {
	if (token) {
		token = token.split(' ')[1]
		console.log(token, 'tokeeeeeeen')
		axios.defaults.headers.common['Authorization'] = token.split(' ')[1]
	} else {
		delete axios.defaults.headers.common['Authorization']
	}
}

export default setAuthToken