/**
 * Single source of truth for auth token storage.
 *
 * Tokens live in localStorage when the user opted into "remember me" and in sessionStorage
 * otherwise, so a session-only login never leaves credentials behind after the browser closes.
 * `AuthService` delegates here rather than keeping its own copy of this logic.
 */

const REMEMBER_ME_KEY = 'rememberMe'

const PERSISTENT_KEYS = { token: 'token', refresh: 'refreshToken', expiry: 'tokenExpiry' }
const SESSION_KEYS = { token: 'session_token', refresh: 'session_refreshToken', expiry: 'session_tokenExpiry' }

let inMemoryToken = null
let inMemoryExpiry = null

const isRemembered = () => localStorage.getItem(REMEMBER_ME_KEY) === 'true'
const keysFor = (remembered) => (remembered ? PERSISTENT_KEYS : SESSION_KEYS)
const storageFor = (remembered) => (remembered ? localStorage : sessionStorage)

// Earlier builds wrote a session token under the persistent key, so fall back across both stores
// on read to avoid logging existing users out on upgrade.
const readAnywhere = (key) => localStorage.getItem(key) || sessionStorage.getItem(key)

export const tokenStore = {
  isRemembered,

  getToken: () => {
    if (inMemoryToken) return inMemoryToken
    const keys = keysFor(isRemembered())
    return storageFor(isRemembered()).getItem(keys.token)
      || readAnywhere(PERSISTENT_KEYS.token)
      || sessionStorage.getItem(SESSION_KEYS.token)
  },

  setToken: (token, expiry, rememberMe = isRemembered()) => {
    inMemoryToken = token
    inMemoryExpiry = expiry ? expiry.toString() : null
    if (!token) return

    localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false')

    const keys = keysFor(rememberMe)
    storageFor(rememberMe).setItem(keys.token, token)
    if (expiry) storageFor(rememberMe).setItem(keys.expiry, expiry.toString())

    // Drop any copy in the storage we are not using, so the two never diverge.
    const unused = keysFor(!rememberMe)
    storageFor(!rememberMe).removeItem(unused.token)
    storageFor(!rememberMe).removeItem(unused.expiry)
  },

  getRefreshToken: () => {
    const keys = keysFor(isRemembered())
    return storageFor(isRemembered()).getItem(keys.refresh) || readAnywhere(PERSISTENT_KEYS.refresh)
  },

  setRefreshToken: (token, rememberMe = isRemembered()) => {
    const keys = keysFor(rememberMe)
    const unused = keysFor(!rememberMe)
    if (token) {
      storageFor(rememberMe).setItem(keys.refresh, token)
    } else {
      storageFor(rememberMe).removeItem(keys.refresh)
    }
    storageFor(!rememberMe).removeItem(unused.refresh)
  },

  removeRefreshToken: () => {
    localStorage.removeItem(PERSISTENT_KEYS.refresh)
    sessionStorage.removeItem(PERSISTENT_KEYS.refresh)
    sessionStorage.removeItem(SESSION_KEYS.refresh)
  },

  getTokenExpiry: () => {
    if (inMemoryExpiry) return inMemoryExpiry
    const keys = keysFor(isRemembered())
    return storageFor(isRemembered()).getItem(keys.expiry) || localStorage.getItem(PERSISTENT_KEYS.expiry)
  },

  clear: () => {
    inMemoryToken = null
    inMemoryExpiry = null
    for (const keys of [PERSISTENT_KEYS, SESSION_KEYS]) {
      for (const key of Object.values(keys)) {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      }
    }
    localStorage.removeItem(REMEMBER_ME_KEY)
  },

  isAuthenticated: () => !!tokenStore.getToken(),
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
