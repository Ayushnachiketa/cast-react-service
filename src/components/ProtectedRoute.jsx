import { Navigate } from 'react-router-dom'
import { getToken } from '../utils/token.js'

// Shows the page only when the user is logged in, otherwise sends them to /login.
function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
