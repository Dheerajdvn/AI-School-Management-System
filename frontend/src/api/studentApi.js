import httpClient from './httpClient'
import { unwrap } from './response'

export const studentApi = {
  list: (params) => httpClient.get('/students', { params }).then((response) => response.data),
  search: (params) => httpClient.get('/students', { params }).then((response) => response.data),
  get: (id) => httpClient.get(`/students/${id}`).then(unwrap),
  create: (data) => httpClient.post('/students', data).then(unwrap),
  update: (id, data) => httpClient.put(`/students/${id}`, data).then(unwrap),
  delete: (id) => httpClient.delete(`/students/${id}`).then(unwrap),
}
