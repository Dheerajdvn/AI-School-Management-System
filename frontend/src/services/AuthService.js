import api from './api'
import { tokenStore, resolveTokenExpiry } from '../api/tokenStore'

// Token persistence lives in api/tokenStore.js, which honours the remember-me preference.
// This module owns JWT decoding, expiry checks, and the login/logout calls only.

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

// Token management (delegated)
const getToken = () => tokenStore.getToken()
const setToken = (token, expiry, rememberMe = true) => tokenStore.setToken(token, expiry, rememberMe)
const getRefreshToken = () => tokenStore.getRefreshToken()
const setRefreshToken = (token, rememberMe = true) => tokenStore.setRefreshToken(token, rememberMe)
const resolveExpiry = resolveTokenExpiry

// Calculate if token is expired
const isTokenExpired = () => {
  const token = getToken()
  if (!token) return true

  const expiry = tokenStore.getTokenExpiry()
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

  const expiry = tokenStore.getTokenExpiry()
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
    const rememberMe = tokenStore.isRemembered()
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
const clearAuth = () => tokenStore.clear()

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
      // No refresh token issued for this login — drop any stale one from a previous session.
      tokenStore.removeRefreshToken()
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