import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT_MS } from '../constants/api'
import { tokenStore, resolveTokenExpiry } from './tokenStore'

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise = null

const refreshAccessToken = async () => {
  const refreshToken = tokenStore.getRefreshToken()
  if (!refreshToken) return null

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, {
    timeout: API_TIMEOUT_MS,
  })
  const payload = response.data?.data || response.data
  const expiry = resolveTokenExpiry(payload)
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

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
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
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default httpClient
