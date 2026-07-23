import { websocketService } from './websocketService'

let subscriptions = []

export const processingSocket = {
  connect: () => {
    websocketService.connect(null, null, null, null)
  },

  disconnect: () => {
    subscriptions.forEach(sub => sub && sub.unsubscribe())
    subscriptions = []
    websocketService.disconnect()
  },

  subscribeToDocumentProgress: (documentId, onProgress) => {
    const sub = websocketService.subscribe(`/topic/document/${documentId}/progress`, (progress) => {
      onProgress && onProgress(progress)
    })
    subscriptions.push(sub)
    return sub
  },

  subscribeToQueueUpdates: (onQueueUpdate) => {
    const sub = websocketService.subscribe('/topic/processing.queue', (update) => {
      onQueueUpdate && onQueueUpdate(update)
    })
    subscriptions.push(sub)
    return sub
  },

  // Status values: UPLOADING, PARSING, CHUNKING, EMBEDDING, VECTOR_STORAGE, COMPLETED, FAILED
  getStatusBadge: (status) => {
    const statusMap = {
      UPLOADING: { color: 'info', text: 'Uploading' },
      PARSING: { color: 'primary', text: 'Parsing' },
      CHUNKING: { color: 'warning', text: 'Chunking' },
      EMBEDDING: { color: 'primary', text: 'Embedding' },
      VECTOR_STORAGE: { color: 'info', text: 'Vector Storage' },
      COMPLETED: { color: 'success', text: 'Completed' },
      FAILED: { color: 'danger', text: 'Failed' },
    }
    return statusMap[status] || { color: 'secondary', text: status }
  },
}

export default processingSocket