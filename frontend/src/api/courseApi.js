import httpClient from './httpClient'
import { unwrap } from './response'

export const courseApi = {
  list: (params) => httpClient.get('/courses', { params }).then(unwrap),
  search: (params) => {
    const cleanParams = { ...(params || {}) }
    if (!cleanParams.status || cleanParams.status === 'All statuses' || cleanParams.status === 'ALL') {
      delete cleanParams.status
    }
    if (!cleanParams.title) {
      delete cleanParams.title
    }
    if (!cleanParams.courseCode) {
      delete cleanParams.courseCode
    }
    const hasFilters = cleanParams.title || cleanParams.status || cleanParams.courseCode || cleanParams.teacherId
    const endpoint = hasFilters ? '/courses/search' : '/courses'
    return httpClient.get(endpoint, { params: cleanParams }).then(unwrap).catch(async () => {
      // Fallback to general list if search endpoint fails
      return httpClient.get('/courses', { params: { page: cleanParams.page || 0, size: cleanParams.size || 20 } }).then(unwrap)
    })
  },
  get: (id) => httpClient.get(`/courses/${id}`).then(unwrap),
  create: (data) => httpClient.post('/courses', data).then(unwrap),
  update: (id, data) => httpClient.put(`/courses/${id}`, data).then(unwrap),
  delete: (id) => httpClient.delete(`/courses/${id}`).then(unwrap),
}
