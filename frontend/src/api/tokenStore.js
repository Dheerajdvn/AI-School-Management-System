let inMemoryToken = null
let inMemoryExpiry = null

export const tokenStore = {
  getToken: () => inMemoryToken || localStorage.getItem('token') || sessionStorage.getItem('token') || sessionStorage.getItem('session_token'),
  setToken: (token, expiry) => {
    inMemoryToken = token
    inMemoryExpiry = expiry ? expiry.toString() : null
    if (token) {
      localStorage.setItem('token', token)
      if (expiry) localStorage.setItem('tokenExpiry', expiry.toString())
    }
  },
  getRefreshToken: () => localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken'),
  setRefreshToken: (token) => {
    if (token) localStorage.setItem('refreshToken', token)
  },
  removeRefreshToken: () => {
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('refreshToken')
  },
  getTokenExpiry: () => inMemoryExpiry || localStorage.getItem('tokenExpiry'),
  clear: () => {
    inMemoryToken = null
    inMemoryExpiry = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiry')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('session_token')
    sessionStorage.removeItem('refreshToken')
  },
  isAuthenticated: () => !!(inMemoryToken || localStorage.getItem('token') || sessionStorage.getItem('token') || sessionStorage.getItem('session_token')),
}

export const resolveTokenExpiry = ({ expiresIn, expiresAt } = {}) => {
  if (expiresIn) {
    return Date.now() + expiresIn * 1000
  }

  if (expiresAt) {
    const parsed = Date.parse(expiresAt)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  return Date.now() + 24 * 60 * 60 * 1000
}
