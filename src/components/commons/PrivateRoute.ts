import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children, auth }) => {
	console.log(auth.isAuthenticated, 'auth.isAuthenticated')
	if (!auth.isAuthenticated) {
		Navigate({ to: '/login' })
		return
	}
	return children
}

export default PrivateRoute