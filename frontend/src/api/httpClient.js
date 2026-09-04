import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT_MS } from '../constants/api'
import { tokenStore, resolveTokenExpiry } from './tokenStore'

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise = null

const refreshAccessToken = async () => {
  const refreshToken = tokenStore.getRefreshToken()
  if (!refreshToken) {
    return null
  }
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, {
    timeout: API_TIMEOUT_MS,
    withCredentials: true,
  })
  const payload = response.data?.data || response.data
  const expiry = resolveTokenExpiry(payload)
  // rememberMe defaults to the stored preference, so a session-only login stays session-only.
  tokenStore.setToken(payload.token, expiry)
  return payload.token
}

httpClient.interceptors.request.use(
  (config) => {
    const token = tokenStore.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
      delete config.headers.common?.['Content-Type']
      delete config.headers.post?.['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Requests that must never trigger a refresh-then-redirect cycle: logging in, probing the current
// session, and the AI health poll all legitimately answer 401 while the user is on /login.
const NO_REDIRECT_PATHS = ['/auth/login', '/auth/refresh', '/auth/me', '/ai/health']
const isExcluded = (url = '') => NO_REDIRECT_PATHS.some((path) => url.includes(path))

// Only 401 is handled here. A 403 means authenticated-but-not-permitted, so it is passed through for
// RoleProtectedRoute / the calling page to surface — logging the user out would hide the real problem.
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const requestUrl = originalRequest?.url || ''

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isExcluded(requestUrl)) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }

        const newToken = await refreshPromise
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return httpClient(originalRequest)
        }
      } catch (refreshError) {
        tokenStore.clear()
      }

      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true'
      }
    }

    return Promise.reject(error)
  }
)

export default httpClient
