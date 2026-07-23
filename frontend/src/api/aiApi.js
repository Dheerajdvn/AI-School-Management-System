import httpClient from './httpClient'
import { unwrap } from './response'

export const aiApi = {
  health: () => httpClient.get('/ai/health').then(unwrap),
  chat: (data) => httpClient.post('/ai/chat', data).then(unwrap),
  streamChat: (data) => httpClient.post('/ai/chat/stream', data, {
    responseType: 'text',
    headers: { Accept: 'text/plain' },
  }).then((response) => response.data),
  ask: (data) => httpClient.post('/ai/ask', data).then(unwrap),
  sql: (data) => httpClient.post('/ai/sql', data).then(unwrap),
}
