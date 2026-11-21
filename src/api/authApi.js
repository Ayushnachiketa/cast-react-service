// All calls to the auth-service live in this file.
// Every function returns the JSON from the server, or throws an Error
// with `error.code` (e.g. "USER_NOT_FOUND") and `error.message`.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, { method = 'POST', body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw createError('NETWORK_ERROR', 'Cannot reach the server. Is auth-service running?')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw createError(data.code || 'UNKNOWN_ERROR', data.message || 'Something went wrong', response.status)
  }
  return data
}

function createError(code, message, status) {
  const error = new Error(message)
  error.code = code
  error.status = status
  return error
}

// ---------- Login ----------

export function requestLoginOtp(identifier) {
  return request('/api/auth/login/request-otp', { body: { identifier } })
}

export function verifyLoginOtp(identifier, otp) {
  return request('/api/auth/login/verify-otp', { body: { identifier, otp } })
}

// ---------- Signup ----------

export function requestSignupOtp(identifier) {
  return request('/api/auth/signup/request-otp', { body: { identifier } })
}

export function verifySignupOtp(identifier, otp) {
  return request('/api/auth/signup/verify-otp', { body: { identifier, otp } })
}

export function submitSignupDetails(signupToken, name, email) {
  return request('/api/auth/signup/details', { body: { signupToken, name, email } })
}

export function completeSignup(signupToken, name, email, otp) {
  return request('/api/auth/signup/complete', { body: { signupToken, name, email, otp } })
}

// ---------- User (needs token) ----------

export function getMyProfile(token) {
  return request('/api/users/me', { method: 'GET', token })
}
