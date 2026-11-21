import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProfile } from '../api/authApi.js'
import AuthCard from '../components/AuthCard.jsx'
import Message from '../components/Message.jsx'
import { clearToken, getToken } from '../utils/token.js'

// Shown after login. Loads the profile with the saved token.
function HomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyProfile(getToken())
      .then(setUser)
      .catch((err) => {
        if (err.status === 401) {
          // Token missing or expired: log in again.
          clearToken()
          navigate('/login', { replace: true })
        } else {
          setError(err.message)
        }
      })
  }, [navigate])

  function logout() {
    clearToken()
    navigate('/login')
  }

  return (
    <AuthCard title={user ? `Hi, ${user.name}` : 'Welcome'} subtitle="You are logged in">
      <Message type="error">{error}</Message>
      {user && (
        <dl className="profile">
          <dt>Email</dt>
          <dd>{user.email || '-'}</dd>
          <dt>Mobile</dt>
          <dd>{user.mobile || '-'}</dd>
        </dl>
      )}
      <button type="button" className="primary" onClick={logout}>
        Log out
      </button>
    </AuthCard>
  )
}

export default HomePage
