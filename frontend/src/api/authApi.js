import httpClient from './httpClient'
import { unwrap } from './response'

export const authApi = {
  login: (credentials) => httpClient.post('/auth/login', credentials).then(unwrap),
  me: () => httpClient.get('/auth/me').then(unwrap),
  refresh: (refreshToken) => httpClient.post('/auth/refresh', { refreshToken }).then(unwrap),
  logoutAllDevices: () => httpClient.post('/auth/logout-all'),
}
