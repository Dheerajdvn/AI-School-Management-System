import httpClient from '../api/httpClient'

const api = httpClient

export const RagApi = {
  chat: (question, courseId) => api.post('/rag/chat', { question, courseId }).then(r => r.data?.data || r.data),
  streamChat: (question, courseId) => api.post('/rag/chat/stream', { question, courseId }, { responseType: 'stream' }).then(r => r.data),
  reindex: (id) => api.post(`/rag/reindex/${id}`).then(r => r.data?.data || r.data),
  reindexAll: () => api.post('/rag/reindex-all').then(r => r.data?.data || r.data),
}

export const AiApi = {
  health: () => api.get('/ai/health').then(r => r.data?.data || r.data),
  ask: (question) => api.post('/ai/ask', { question }).then(r => r.data?.data || r.data),
}

export const AiConfigApi = {
  getConfig: () => api.get('/ai/config').then(r => r.data?.data || r.data),
  saveConfig: (data) => api.post('/ai/config', data).then(r => r.data?.data || r.data),
  verifyConnection: (data) => api.post('/ai/config/verify', data).then(r => r.data?.data || r.data),
  resetConfig: () => api.post('/ai/config/reset').then(r => r.data?.data || r.data),
  getProviders: () => api.get('/ai/config/providers').then(r => r.data?.data || r.data),
  getProviderInfo: () => api.get('/ai/config/providers/info').then(r => r.data?.data || r.data),
}

export const DashboardApi = {
  totals: () => api.get('/dashboard/totals').then(r => r.data?.data || r.data),
  byCourse: () => api.get('/dashboard/enrollment-by-course').then(r => r.data?.data || r.data),
  documentsMonthly: (months = 12) => api.get(`/dashboard/documents-monthly?months=${months}`).then(r => r.data?.data || r.data),
  recentDocuments: (limit = 5) => api.get(`/dashboard/recent-documents?limit=${limit}`).then(r => r.data?.data || r.data),
  recentStudents: (size = 5) => api.get(`/dashboard/recent-students?size=${size}`).then(r => r.data?.data || r.data),
  userGrowth: (months = 12) => api.get(`/dashboard/user-growth?months=${months}`).then(r => r.data?.data || r.data),
}

export const DocumentApi = {
  list: (params) => api.get('/documents', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/documents/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/documents', data).then(r => r.data?.data || r.data),
  upload: (file, courseId, documentType, userId, onUploadProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    if (courseId) formData.append('courseId', courseId)
    if (documentType) formData.append('documentType', documentType)
    return api.post('/documents/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onUploadProgress(percentCompleted)
        }
      },
    }).then(r => r.data?.data || r.data)
  },
  download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' }).then(r => r.data),
  getContent: (id) => api.get(`/documents/${id}/content`).then(r => r.data?.data || r.data),
  remove: (id) => api.delete(`/documents/${id}`).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/documents/${id}`).then(r => r.data?.data || r.data),
}

export const GradeApi = {
  list: (params) => api.get('/grades', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/grades/${id}`).then(r => r.data?.data || r.data),
  grade: (submissionId, data) => api.put(`/grades/${submissionId}`, data).then(r => r.data?.data || r.data),
  publish: (submissionId) => api.put(`/grades/${submissionId}/publish`).then(r => r.data?.data || r.data),
}

export const StudentApi = {
  list: (params) => api.get('/students', { params }).then(r => r.data?.data || r.data),
  search: (params) => api.get('/students/search', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/students/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/students', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/students/${id}`, data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/students/${id}`).then(r => r.data?.data || r.data),
  remove: (id) => api.delete(`/students/${id}`).then(r => r.data?.data || r.data),
}

export const AssignmentApi = {
  list: (params) => api.get('/assignments', { params }).then(r => r.data?.data || r.data),
  search: (params) => api.get('/assignments/search', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/assignments/${id}`).then(r => r.data?.data || r.data),
  create: (data, courseId) => {
    const cid = courseId || data?.courseId
    return api.post('/assignments', data, { params: cid ? { courseId: cid } : {} }).then(r => r.data?.data || r.data)
  },
  update: (id, data) => api.put(`/assignments/${id}`, data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/assignments/${id}`).then(r => r.data?.data || r.data),
}

export const SubmissionApi = {
  list: (params) => api.get('/submissions', { params }).then(r => r.data?.data || r.data),
  search: (params) => api.get('/submissions/search', { params }).then(r => r.data?.data || r.data),
  getByAssignment: (assignmentId, params) => api.get(`/submissions/assignment/${assignmentId}`, { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/submissions/${id}`).then(r => r.data?.data || r.data),
  create: (data, assignmentId) => {
    const aid = assignmentId || data?.assignmentId
    return api.post('/submissions', data, { params: aid ? { assignmentId: aid } : {} }).then(r => r.data?.data || r.data)
  },
}

export const CourseApi = {
  list: (params) => api.get('/courses', { params }).then(r => r.data?.data || r.data),
  search: (params) => api.get('/courses/search', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/courses/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/courses', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/courses/${id}`, data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/courses/${id}`).then(r => r.data?.data || r.data),
  remove: (id) => api.delete(`/courses/${id}`).then(r => r.data?.data || r.data),
}

export const EnrollmentApi = {
  list: (params) => api.get('/enrollments', { params }).then(r => r.data?.data || r.data),
  getByCourse: (courseId, params) => api.get(`/enrollments/course/${courseId}`, { params }).then(r => r.data?.data || r.data),
}

export const SchoolApi = {
  list: (params) => api.get('/schools', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/schools/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/schools', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/schools/${id}`, data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/schools/${id}`).then(r => r.data?.data || r.data),
  toggleStatus: (id) => api.post(`/schools/${id}/toggle-status`).then(r => r.data?.data || r.data),
}

export const UserApi = {
  list: (params) => api.get('/users', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/users/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/users', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(r => r.data?.data || r.data),
  remove: (id) => api.delete(`/users/${id}`).then(r => r.data?.data || r.data),
  setEnabled: (id, enabled) => api.post(`/users/${id}/enable?enabled=${enabled}`).then(r => r.data?.data || r.data),
  uploadPicture: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/users/${id}/picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data?.data || r.data)
  },
  removePicture: (id) => api.delete(`/users/${id}/picture`).then(r => r.data?.data || r.data),
}

export const SchoolAdminApi = {
  list: (params) => api.get('/school-admins', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/school-admins/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/school-admins', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/school-admins/${id}`, data).then(r => r.data?.data || r.data),
}

export const SubscriptionApi = {
  list: (params) => api.get('/subscriptions', { params }).then(r => r.data?.data || r.data),
  get: (id) => api.get(`/subscriptions/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/subscriptions', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data).then(r => r.data?.data || r.data),
}

export const AuditApi = {
  list: (params) => api.get('/audit-logs', { params }).then(r => r.data?.data || r.data),
}

export default api