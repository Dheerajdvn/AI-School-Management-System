import { useState, useCallback, useEffect } from 'react'
import { processingSocket } from '../services/processingSocket'

export function useDocumentProcessing() {
  const [queueUpdates, setQueueUpdates] = useState([])
  const [documentProgress, setDocumentProgress] = useState({})

  const subscribeToQueue = useCallback(() => {
    processingSocket.subscribeToQueueUpdates((update) => {
      setQueueUpdates(prev => [update, ...prev.slice(0, 9)])
    })
  }, [])

  const subscribeToDocument = useCallback((documentId) => {
    processingSocket.subscribeToDocumentProgress(documentId, (progress) => {
      setDocumentProgress(prev => ({
        ...prev,
        [documentId]: progress
      }))
    })
  }, [])

  const unsubscribeFromDocument = useCallback((documentId) => {
    setDocumentProgress(prev => {
      const { [documentId]: _, ...rest } = prev
      return rest
    })
  }, [])

  const getStatusBadge = processingSocket.getStatusBadge

  useEffect(() => {
    subscribeToQueue()
    return () => {
      processingSocket.disconnect()
    }
  }, [subscribeToQueue])

  return {
    queueUpdates,
    documentProgress,
    subscribeToDocument,
    unsubscribeFromDocument,
    getStatusBadge,
  }
}

export default useDocumentProcessing