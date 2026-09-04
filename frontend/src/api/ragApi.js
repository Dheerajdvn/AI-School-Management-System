import httpClient from './httpClient'
import { unwrap } from './response'
import { tokenStore } from './tokenStore'

export const ragApi = {
  chat: (message) => httpClient.post('/ai/chat', { message }).then(unwrap),

  streamChatSse: async ({ question, sessionId, courseId, onSources, onToken, onDone, onError, signal }) => {
    // Raw fetch bypasses the axios interceptor, so read through tokenStore to honour remember-me.
    const token = tokenStore.getToken()
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
      let currentEvent = 'message'

      // Safety timeout: 45 seconds maximum wait
      const timeoutTimer = setTimeout(() => {
        try { reader.cancel() } catch (e) {}
        if (onError) onError('AI response timed out. Please retry your query.')
      }, 45000)

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (trimmed.startsWith('event:')) {
              currentEvent = trimmed.substring(6).trim()
            } else if (trimmed.startsWith('data:')) {
              const rawData = line.startsWith('data: ') ? line.substring(6) : (line.startsWith('data:') ? line.substring(5) : '')
              if (currentEvent === 'sources' && onSources) {
                try { onSources(JSON.parse(rawData.trim())) } catch (e) { console.error(e) }
              } else if (currentEvent === 'token' && onToken) {
                onToken(rawData)
              } else if (currentEvent === 'done' && onDone) {
                try { onDone(JSON.parse(rawData.trim())) } catch (e) { onDone({ done: true }) }
              } else if (currentEvent === 'error' && onError) {
                onError(rawData.trim())
              }
            }
          }
        }
      } finally {
        clearTimeout(timeoutTimer)
      }

      if (onDone) {
        onDone({ done: true })
      }
    } catch (err) {
      if (err.name !== 'AbortError' && onError) {
        onError(err.message || 'Streaming request failed')
      }
    }
  }
}

export default ragApi
