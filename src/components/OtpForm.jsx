import TextField from './TextField.jsx'

// The "enter the 6-digit code" form, shared by the login and signup pages.
function OtpForm({ sentTo, otp, setOtp, onSubmit, onResend, onBack, loading, submitLabel = 'Verify OTP' }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="hint">
        We sent a 6-digit code to <strong>{sentTo}</strong>
      </p>
      <TextField
        label="OTP"
        value={otp}
        onChange={(value) => setOtp(value.replace(/\D/g, ''))}
        placeholder="123456"
        maxLength={6}
        autoFocus
      />
      <button type="submit" className="primary" disabled={loading || otp.length !== 6}>
        {loading ? 'Please wait...' : submitLabel}
      </button>
      <div className="row">
        <button type="button" className="link" onClick={onBack} disabled={loading}>
          Change
        </button>
        <button type="button" className="link" onClick={onResend} disabled={loading}>
          Resend OTP
        </button>
      </div>
    </form>
  )
}

export default OtpForm
