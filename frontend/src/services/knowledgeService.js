import api from './api'

// Knowledge Center Service
export const knowledgeService = {
  // Get knowledge dashboard statistics
  getDashboard: async () => {
    const response = await api.get('/knowledge/dashboard')
    return response.data?.data || response.data
  },

  // Upload document
  uploadDocument: async (formData) => {
    const response = await api.post('/knowledge/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data?.data || response.data
  },

  // Get document list
  getDocuments: async (params = {}) => {
    const response = await api.get('/knowledge/documents', { params })
    return response.data?.data || response.data
  },

  // Get document by ID
  getDocument: async (id) => {
    const response = await api.get(`/knowledge/documents/${id}`)
    return response.data?.data || response.data
  },

  // Delete document
  deleteDocument: async (id) => {
    const response = await api.delete(`/knowledge/documents/${id}`)
    return response.data?.data || response.data
  },

  // Reindex document
  reindexDocument: async (id) => {
    const response = await api.post(`/knowledge/documents/${id}/reindex`)
    return response.data?.data || response.data
  },

  // Search documents
  searchDocuments: async (query) => {
    const response = await api.post('/knowledge/search', { query })
    return response.data?.data || response.data
  },

  // Get collections
  getCollections: async () => {
    const response = await api.get('/knowledge/collections')
    return response.data?.data || response.data
  },

  // Create collection
  createCollection: async (data) => {
    const response = await api.post('/knowledge/collections', data)
    return response.data?.data || response.data
  },

  // Get processing queue
  getProcessingQueue: async () => {
    const response = await api.get('/knowledge/queue')
    return response.data?.data || response.data
  },

  // Generate embedding
  generateEmbedding: async (text) => {
    const response = await api.post('/ai/embedding', { text })
    return response.data?.data || response.data
  },

  // Chat with knowledge context
  chatWithContext: async (data) => {
    const response = await api.post('/ai/chat', data)
    return response.data?.data || response.data
  },
}

export default knowledgeService