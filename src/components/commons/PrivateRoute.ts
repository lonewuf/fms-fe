import { Navigate } from "react-router-dom"
import { useTypedSelector } from "../../store"

const PrivateRoute = ({ children, auth }) => {

	if (!auth.isAuthenticated) {
		Navigate({ to: '/login' })
		return
	}
	return children
}

export default PrivateRoute