/**
 * Token storage utility for JWT management.
 * 
 * Provides secure storage and retrieval of authentication tokens
 * using localStorage with a consistent key.
 */

const TOKEN_KEY = 'token'
const USER_KEY = 'auth_user'

/**
 * Save JWT token to localStorage
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (error) {
    console.error('Failed to save token:', error)
  }
}

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (error) {
    console.error('Failed to get token:', error)
    return null
  }
}

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (error) {
    console.error('Failed to remove token:', error)
  }
}

/**
 * Save user data to localStorage
 * @param {Object} user - User data object
 */
export const saveUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null if not found
 */
export const getUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Failed to get user:', error)
    return null
  }
}

/**
 * Remove user data from localStorage
 */
export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('Failed to remove user:', error)
  }
}

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  removeToken()
  removeUser()
}

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken()
}