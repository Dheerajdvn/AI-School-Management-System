import httpClient from './httpClient'
import { unwrap } from './response'

export const ragApi = {
  chat: (message) => httpClient.post('/ai/chat', { message }).then(unwrap),

  streamChatSse: async ({ question, sessionId, courseId, onSources, onToken, onDone, onError, signal }) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/rag/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ question, sessionId, courseId }),
        signal
      })

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        let currentEvent = 'message'
        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('event:')) {
            currentEvent = trimmed.substring(6).trim()
          } else if (trimmed.startsWith('data:')) {
            const dataStr = trimmed.substring(5).trim()
            if (currentEvent === 'sources' && onSources) {
              try { onSources(JSON.parse(dataStr)) } catch (e) { console.error(e) }
            } else if (currentEvent === 'token' && onToken) {
              onToken(dataStr)
            } else if (currentEvent === 'done' && onDone) {
              try { onDone(JSON.parse(dataStr)) } catch (e) { onDone({ done: true }) }
            } else if (currentEvent === 'error' && onError) {
              onError(dataStr)
            }
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError' && onError) {
        onError(err.message || 'Streaming request failed')
      }
    }
  }
}

export default ragApi
