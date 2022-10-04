import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children, auth }) => {
	if (!auth.isAuthenticated) {
		Navigate({ to: '/login' })
		return
	}
	return children
}

export default PrivateRoute