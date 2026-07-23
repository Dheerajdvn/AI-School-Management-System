import api from './api'

// AI Chat Service
export const aiChatService = {
  // Send chat message to AI
  chat: async (data) => {
    const response = await api.post('/ai/chat', data)
    return response.data?.data || response.data
  },

  // Stream chat response
  streamChat: async (data) => {
    const response = await api.post('/ai/chat/stream', data, {
      responseType: 'text',
      headers: {
        'Accept': 'text/plain',
      },
    })
    return response.data
  },

  // Check AI health
  health: async () => {
    const response = await api.get('/ai/health')
    return response.data?.data || response.data
  },
}

export default aiChatService