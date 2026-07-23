import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 401 handling is done in AuthService.js to support token refresh logic.
// Do NOT add a 401 response interceptor here - it would conflict.

// RAG API (AI Chat)
export const RagApi = {
  chat: (message) => api.post('/ai/chat', { message }).then(r => r.data?.data || r.data),
  streamChat: (message) => api.post('/ai/chat/stream', { message }, { responseType: 'stream' }).then(r => r.data),
}

// AI API (for Topbar and AskAiPage health check)
export const AiApi = {
  health: () => api.get('/ai/health').then(r => r.data?.data || r.data),
}

// Dashboard API endpoints
export const DashboardApi = {
  totals: () => api.get('/dashboard/totals').then(r => r.data?.data || r.data),
  byCourse: () => api.get('/dashboard/enrollment-by-course').then(r => r.data?.data || r.data),
  documentsMonthly: (months = 12) => api.get(`/dashboard/documents-monthly?months=${months}`).then(r => r.data?.data || r.data),
  recentDocuments: (limit = 5) => api.get(`/dashboard/recent-documents?limit=${limit}`).then(r => r.data?.data || r.data),
  recentStudents: (size = 5) => api.get(`/dashboard/recent-students?size=${size}`).then(r => r.data?.data || r.data),
  userGrowth: (months = 12) => api.get(`/dashboard/user-growth?months=${months}`).then(r => r.data?.data || r.data),
}

// Document API endpoints
export const DocumentApi = {
  list: (params) => api.get('/documents', { params }).then(r => r.data),
  get: (id) => api.get(`/documents/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/documents', data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/documents/${id}`).then(r => r.data?.data || r.data),
}

// Grade API endpoints
export const GradeApi = {
  list: (params) => api.get('/grades', { params }).then(r => r.data),
  get: (id) => api.get(`/grades/${id}`).then(r => r.data?.data || r.data),
  grade: (submissionId, data) => api.post(`/grades/${submissionId}`, data).then(r => r.data?.data || r.data),
  publish: (submissionId) => api.post(`/grades/${submissionId}/publish`).then(r => r.data?.data || r.data),
}

// Student API endpoints
export const StudentApi = {
  list: (params) => api.get('/students', { params }).then(r => r.data),
  search: (params) => api.get('/students/search', { params }).then(r => r.data),
  get: (id) => api.get(`/students/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/students', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/students/${id}`, data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/students/${id}`).then(r => r.data?.data || r.data),
  remove: (id) => api.delete(`/students/${id}`).then(r => r.data?.data || r.data),
}

// Assignment API endpoints
export const AssignmentApi = {
  list: (params) => api.get('/assignments', { params }).then(r => r.data),
  get: (id) => api.get(`/assignments/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/assignments', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/assignments/${id}`, data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/assignments/${id}`).then(r => r.data?.data || r.data),
}

// Submission API endpoints
export const SubmissionApi = {
  list: (params) => api.get('/submissions', { params }).then(r => r.data),
  get: (id) => api.get(`/submissions/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/submissions', data).then(r => r.data?.data || r.data),
}

// Course API endpoints
export const CourseApi = {
  list: (params) => api.get('/courses', { params }).then(r => r.data),
  search: (params) => api.get('/courses/search', { params }).then(r => r.data),
  get: (id) => api.get(`/courses/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/courses', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/courses/${id}`, data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/courses/${id}`).then(r => r.data?.data || r.data),
  remove: (id) => api.delete(`/courses/${id}`).then(r => r.data?.data || r.data),
}

// Enrollment API endpoints
export const EnrollmentApi = {
  list: (params) => api.get('/enrollments', { params }).then(r => r.data),
}

// School API endpoints
export const SchoolApi = {
  list: (params) => api.get('/schools', { params }).then(r => r.data),
  get: (id) => api.get(`/schools/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/schools', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/schools/${id}`, data).then(r => r.data?.data || r.data),
  delete: (id) => api.delete(`/schools/${id}`).then(r => r.data),
  toggleStatus: (id) => api.post(`/schools/${id}/toggle-status`).then(r => r.data?.data || r.data),
}

// User API endpoints
export const UserApi = {
  list: (params) => api.get('/users', { params }).then(r => r.data),
  get: (id) => api.get(`/users/${id}`).then(r => r.data?.data || r.data),
  create: (data) => api.post('/users', data).then(r => r.data?.data || r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(r => r.data?.data || r.data),
  remove: (id) => api.delete(`/users/${id}`).then(r => r.data),
  setEnabled: (id, enabled) => api.post(`/users/${id}/enable?enabled=${enabled}`).then(r => r.data?.data || r.data),
}

export default api