import httpClient from './httpClient'
import { unwrap } from './response'

export const assignmentApi = {
  list: (params) => httpClient.get('/assignments', { params }).then((response) => response.data),
  search: (params) => httpClient.get('/assignments/search', { params }).then((response) => response.data),
  get: (id) => httpClient.get(`/assignments/${id}`).then(unwrap),
  create: (data, courseId) => httpClient.post('/assignments', data, { params: courseId ? { courseId } : {} }).then(unwrap),
  update: (id, data) => httpClient.put(`/assignments/${id}`, data).then(unwrap),
  delete: (id) => httpClient.delete(`/assignments/${id}`).then(unwrap),
}
