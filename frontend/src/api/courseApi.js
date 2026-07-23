import httpClient from './httpClient'
import { unwrap } from './response'

export const courseApi = {
  list: (params) => httpClient.get('/courses', { params }).then((response) => response.data),
  search: (params) => httpClient.get('/courses', { params }).then((response) => response.data),
  get: (id) => httpClient.get(`/courses/${id}`).then(unwrap),
  create: (data) => httpClient.post('/courses', data).then(unwrap),
  update: (id, data) => httpClient.put(`/courses/${id}`, data).then(unwrap),
  delete: (id) => httpClient.delete(`/courses/${id}`).then(unwrap),
}
