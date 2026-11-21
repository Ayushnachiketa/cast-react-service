// The JWT access token is kept in localStorage so the user stays logged in after a page refresh.
const TOKEN_KEY = 'accessToken'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}
