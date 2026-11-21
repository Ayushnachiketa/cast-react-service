import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  completeSignup,
  requestSignupOtp,
  submitSignupDetails,
  verifyLoginOtp,
  verifySignupOtp,
} from '../api/authApi.js'
import AuthCard from '../components/AuthCard.jsx'
import Message from '../components/Message.jsx'
import OtpForm from '../components/OtpForm.jsx'
import TextField from '../components/TextField.jsx'
import { saveToken } from '../utils/token.js'

// Signup steps:
//   1. ENTER_IDENTIFIER       user types email or mobile
//        - already registered -> LOGIN_OTP (we log them in with OTP instead)
//        - new user           -> VERIFY_IDENTIFIER_OTP
//   2. VERIFY_IDENTIFIER_OTP  user types the OTP -> server gives a signupToken
//   3. ENTER_DETAILS          user types name + email
//        - same email as step 1 -> account created, done
//        - otherwise            -> VERIFY_EMAIL_OTP
//   4. VERIFY_EMAIL_OTP       user types the email OTP -> account created, done
function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [step, setStep] = useState('ENTER_IDENTIFIER')
  const [identifier, setIdentifier] = useState(searchParams.get('identifier') || '')
  const [otp, setOtp] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [signupToken, setSignupToken] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  // Runs an API call with loading + error handling, so each step stays short.
  async function run(apiCall) {
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await apiCall()
    } catch (err) {
      if (err.code === 'SIGNUP_TOKEN_INVALID') {
        startOver()
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function finishLogin(result) {
    saveToken(result.accessToken)
    navigate('/')
  }

  function startOver() {
    setStep('ENTER_IDENTIFIER')
    setOtp('')
    setSignupToken('')
  }

  // Step 1
  function sendIdentifierOtp() {
    return run(async () => {
      const result = await requestSignupOtp(identifier)
      setSentTo(result.sentTo)
      setOtp('')
      if (result.userExists) {
        setStep('LOGIN_OTP')
        setInfo('You already have an account. Enter the OTP to log in.')
      } else {
        setStep('VERIFY_IDENTIFIER_OTP')
      }
    })
  }

  // Step 2
  function verifyIdentifierOtp() {
    return run(async () => {
      const result = await verifySignupOtp(identifier, otp)
      setSignupToken(result.signupToken)
      if (result.verifiedIdentifier.includes('@')) {
        setEmail(result.verifiedIdentifier)
      }
      setOtp('')
      setStep('ENTER_DETAILS')
    })
  }

  // Step 3
  function sendDetails() {
    return run(async () => {
      const result = await submitSignupDetails(signupToken, name, email)
      if (result.accessToken) {
        finishLogin(result)
        return
      }
      setSentTo(result.sentTo)
      setOtp('')
      setStep('VERIFY_EMAIL_OTP')
    })
  }

  // Step 4
  function verifyEmailOtp() {
    return run(async () => {
      const result = await completeSignup(signupToken, name, email, otp)
      finishLogin(result)
    })
  }

  // Existing user: log in with the OTP sent in step 1
  function verifyLogin() {
    return run(async () => {
      const result = await verifyLoginOtp(identifier, otp)
      finishLogin(result)
    })
  }

  function handleIdentifierSubmit(event) {
    event.preventDefault()
    sendIdentifierOtp()
  }

  function handleDetailsSubmit(event) {
    event.preventDefault()
    sendDetails()
  }

  return (
    <AuthCard title="Create account" subtitle="Sign up with your email or mobile number">
      <Message type="error">{error}</Message>
      <Message type="info">{info}</Message>

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

      {step === 'VERIFY_IDENTIFIER_OTP' && (
        <OtpForm
          sentTo={sentTo}
          otp={otp}
          setOtp={setOtp}
          onSubmit={verifyIdentifierOtp}
          onResend={sendIdentifierOtp}
          onBack={startOver}
          loading={loading}
        />
      )}

      {step === 'LOGIN_OTP' && (
        <OtpForm
          sentTo={sentTo}
          otp={otp}
          setOtp={setOtp}
          onSubmit={verifyLogin}
          onResend={sendIdentifierOtp}
          onBack={startOver}
          loading={loading}
          submitLabel="Log in"
        />
      )}

      {step === 'ENTER_DETAILS' && (
        <form onSubmit={handleDetailsSubmit}>
          <TextField label="Full name" value={name} onChange={setName} placeholder="Your name" autoFocus />
          <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <button type="submit" className="primary" disabled={loading || !name.trim() || !email.trim()}>
            {loading ? 'Please wait...' : 'Continue'}
          </button>
        </form>
      )}

      {step === 'VERIFY_EMAIL_OTP' && (
        <OtpForm
          sentTo={sentTo}
          otp={otp}
          setOtp={setOtp}
          onSubmit={verifyEmailOtp}
          onResend={sendDetails}
          onBack={() => setStep('ENTER_DETAILS')}
          loading={loading}
          submitLabel="Create account"
        />
      )}

      <p className="footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthCard>
  )
}

export default SignupPage
