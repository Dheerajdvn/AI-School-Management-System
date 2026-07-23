import api from './api'

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'
const TOKEN_EXPIRY_KEY = 'tokenExpiry'
const REMEMBER_ME_KEY = 'rememberMe'
const SESSION_TOKEN_KEY = 'session_token'
const SESSION_REFRESH_KEY = 'session_refreshToken'
const SESSION_EXPIRY_KEY = 'session_tokenExpiry'

// Get storage based on remember-me preference
const getStorage = () => {
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  return rememberMe ? localStorage : sessionStorage
}

// Decode JWT payload (base64)
const decodeJwt = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

const getTokenExpiryFromJwt = (token) => {
  const decoded = decodeJwt(token)
  if (decoded && decoded.exp) {
    return decoded.exp * 1000 // exp is in seconds, convert to ms
  }
  return null
}

// Token management
const getToken = () => {
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  if (rememberMe) {
    return localStorage.getItem(TOKEN_KEY)
  }
  return sessionStorage.getItem(SESSION_TOKEN_KEY)
}

const setToken = (token, expiry, rememberMe = true) => {
  localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false')
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString())
    sessionStorage.removeItem(SESSION_TOKEN_KEY)
    sessionStorage.removeItem(SESSION_EXPIRY_KEY)
  } else {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token)
    sessionStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString())
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
  }
}

const getRefreshToken = () => {
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  if (rememberMe) {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
  return sessionStorage.getItem(SESSION_REFRESH_KEY)
}

const setRefreshToken = (token, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
    sessionStorage.removeItem(SESSION_REFRESH_KEY)
  } else {
    sessionStorage.setItem(SESSION_REFRESH_KEY, token)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

const resolveExpiry = ({ expiresIn, expiresAt } = {}) => {
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

// Calculate if token is expired
const isTokenExpired = () => {
  const token = getToken()
  if (!token) return true

  // Check stored expiry first
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  const expiryKey = rememberMe ? TOKEN_EXPIRY_KEY : SESSION_EXPIRY_KEY
  const expiry = rememberMe
    ? localStorage.getItem(expiryKey)
    : sessionStorage.getItem(expiryKey)

  if (expiry) {
    const expiryTime = parseInt(expiry, 10)
    if (Date.now() >= expiryTime) return true
  }

  // Also check JWT exp claim
  const jwtExp = getTokenExpiryFromJwt(token)
  if (jwtExp && Date.now() >= jwtExp) return true

  return false
}

// Check if token is about to expire (within 5 minutes)
const isTokenExpiringSoon = () => {
  const token = getToken()
  if (!token) return false

  const jwtExp = getTokenExpiryFromJwt(token)
  if (jwtExp) {
    return Date.now() >= jwtExp - 5 * 60 * 1000
  }

  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  const expiryKey = rememberMe ? TOKEN_EXPIRY_KEY : SESSION_EXPIRY_KEY
  const expiry = rememberMe
    ? localStorage.getItem(expiryKey)
    : sessionStorage.getItem(expiryKey)

  if (!expiry) return false
  const expiryTime = parseInt(expiry, 10)
  return Date.now() >= expiryTime - 5 * 60 * 1000
}

// Refresh token
const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await api.post('/auth/refresh', { refreshToken })
    const { token, refreshToken: newRefreshToken, expiresIn, expiresAt } = response.data?.data || response.data
    const expiry = resolveExpiry({ expiresIn, expiresAt })
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true'
    setToken(token, expiry, rememberMe)
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken, rememberMe)
    }
    return token
  } catch (error) {
    clearAuth()
    return null
  }
}

// Clear all auth data from both storages
const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
  localStorage.removeItem(REMEMBER_ME_KEY)
  sessionStorage.removeItem(SESSION_TOKEN_KEY)
  sessionStorage.removeItem(SESSION_REFRESH_KEY)
  sessionStorage.removeItem(SESSION_EXPIRY_KEY)
}

// Auto-refresh interceptor and 401/403 handler
let refreshPromise = null

const handleUnauthorized = () => {
  clearAuth()
  // Use window.location since this runs outside React's lifecycle
  const expired = isTokenExpired()
  const redirectUrl = expired ? '/login?expired=true' : '/login'
  window.location.href = redirectUrl
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status

    // Handle 401 and 403 identically - redirect to login
    if (status === 401 || status === 403) {
      // Don't intercept login or auth/me calls to avoid redirect loops
      const url = error.config?.url || ''
      if (url.includes('/auth/login') || url.includes('/auth/me')) {
        return Promise.reject(error)
      }

      const originalRequest = error.config

      // For 401, try token refresh first (once)
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        if (!refreshPromise) {
          refreshPromise = refreshAuthToken().finally(() => {
            refreshPromise = null
          })
        }

        const newToken = await refreshPromise
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      }

      // Refresh failed or 403 - redirect to login
      if (window.location.pathname !== '/login') {
        handleUnauthorized()
      }
    }

    return Promise.reject(error)
  }
)

// Calculate if user is authenticated
const isAuthenticated = () => {
  const token = getToken()
  if (!token) return false
  // Also check if token is expired
  return !isTokenExpired()
}

// Get current user
const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data?.data || response.data
  } catch (error) {
    // If unauthorized, clear auth
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAuth()
    }
    return null
  }
}

export const authService = {
  login: async (credentials, rememberMe = true) => {
    const response = await api.post('/auth/login', credentials)
    const { token, refreshToken, expiresIn, expiresAt } = response.data?.data || response.data
    const expiry = resolveExpiry({ expiresIn, expiresAt })
    setToken(token, expiry, rememberMe)
    if (refreshToken) {
      setRefreshToken(refreshToken, rememberMe)
    } else {
      const storage = rememberMe ? localStorage : sessionStorage
      const refreshKey = rememberMe ? REFRESH_TOKEN_KEY : SESSION_REFRESH_KEY
      storage.removeItem(refreshKey)
    }
    return response.data
  },

  logout: () => {
    clearAuth()
  },

  logoutAllDevices: async () => {
    try {
      await api.post('/auth/logout-all')
    } catch (e) {
      console.error('Logout all devices failed', e)
    }
    clearAuth()
  },

  getToken,
  isTokenExpired,
  isTokenExpiringSoon,
  refreshAuthToken,
  clearAuth,
  decodeJwt,
}

// Export individual functions for use in AuthContext
export const login = authService.login
export const logout = authService.logout
export { isAuthenticated, getCurrentUser }

export default authService