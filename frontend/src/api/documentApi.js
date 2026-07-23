import httpClient from './httpClient'
import { unwrap } from './response'

export const documentApi = {
  list: (params) => httpClient.get('/documents', { params }).then((response) => response.data),
  search: (params) => httpClient.get('/documents', { params }).then((response) => response.data),
  get: (id) => httpClient.get(`/documents/${id}`).then(unwrap),
  create: (data) => httpClient.post('/documents', data).then(unwrap),
  upload: (formData) => httpClient.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(unwrap),
  delete: (id) => httpClient.delete(`/documents/${id}`).then(unwrap),
}
