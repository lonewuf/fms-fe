import axios from "./axios"

export enum Method {
	get = 'get',
	post = 'post',
	patch = 'patch',
	delete = 'delete',
}

const axiosRequest = async (method: Method, url: string, body?: any) => {
	try {
		if (method === Method.post || method === Method.patch) {
			return await axios[`${method}`](url, { ...body })
		} else {
			return await axios[`${method}`](url)
		}
	} catch (error: any) {
		return error
	}
}

export default axiosRequest