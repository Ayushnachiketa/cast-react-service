import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestLoginOtp, verifyLoginOtp } from '../api/authApi.js'
import AuthCard from '../components/AuthCard.jsx'
import Message from '../components/Message.jsx'
import OtpForm from '../components/OtpForm.jsx'
import TextField from '../components/TextField.jsx'
import { saveToken } from '../utils/token.js'

// Login has 2 steps:
//   1. ENTER_IDENTIFIER: user types email or mobile -> we ask the server to send an OTP
//   2. ENTER_OTP:        user types the OTP -> server returns a token -> go to home page
function LoginPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('ENTER_IDENTIFIER')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [userNotFound, setUserNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  async function sendOtp() {
    setError('')
    setInfo('')
    setUserNotFound(false)
    setLoading(true)
    try {
      const result = await requestLoginOtp(identifier)
      setSentTo(result.sentTo)
      setOtp('')
      setStep('ENTER_OTP')
      return true
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        setUserNotFound(true)
      } else {
        setError(err.message)
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  async function verifyOtp() {
    setError('')
    setLoading(true)
    try {
      const result = await verifyLoginOtp(identifier, otp)
      saveToken(result.accessToken)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function resendOtp() {
    const sent = await sendOtp()
    if (sent) setInfo('A new OTP has been sent')
  }

  function handleIdentifierSubmit(event) {
    event.preventDefault()
    sendOtp()
  }

  function goBack() {
    setStep('ENTER_IDENTIFIER')
    setError('')
    setInfo('')
  }

  return (
    <AuthCard title="Log in" subtitle="Use your email or mobile number">
      <Message type="error">{error}</Message>
      <Message type="info">{info}</Message>

      {userNotFound && (
        <Message type="error">
          No account found for <strong>{identifier}</strong>.{' '}
          <Link to={`/signup?identifier=${encodeURIComponent(identifier)}`}>Sign up instead</Link>
        </Message>
      )}

      {step === 'ENTER_IDENTIFIER' && (
        <form onSubmit={handleIdentifierSubmit}>
          <TextField
            label="Email or mobile number"
            value={identifier}
            onChange={setIdentifier}
            placeholder="you@example.com or 9876543210"
            autoFocus
          />
          <button type="submit" className="primary" disabled={loading || !identifier.trim()}>
            {loading ? 'Please wait...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 'ENTER_OTP' && (
        <OtpForm
          sentTo={sentTo}
          otp={otp}
          setOtp={setOtp}
          onSubmit={verifyOtp}
          onResend={resendOtp}
          onBack={goBack}
          loading={loading}
          submitLabel="Log in"
        />
      )}

      <p className="footer">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthCard>
  )
}

export default LoginPage
