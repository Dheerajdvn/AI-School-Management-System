import httpClient from './httpClient'
import { unwrap } from './response'

export const ragApi = {
  chat: (message) => httpClient.post('/ai/chat', { message }).then(unwrap),
  streamChat: (message) => httpClient.post('/ai/chat/stream', { message }, {
    responseType: 'stream',
  }).then((response) => response.data),
}
