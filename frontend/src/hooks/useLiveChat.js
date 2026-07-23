import { useState, useCallback, useEffect } from 'react'
import { chatSocket } from '../services/chatSocket'

export function useLiveChat(conversationId) {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const connect = useCallback(() => {
    chatSocket.connect()
  }, [])

  const disconnect = useCallback(() => {
    chatSocket.disconnect()
  }, [])

  const subscribe = useCallback((onMessage, onTyping) => {
    chatSocket.subscribeToConversation(
      conversationId,
      (message) => {
        setMessages(prev => [...prev, message])
        onMessage && onMessage(message)
      },
      (data) => {
        setTyping(data.typing)
        onTyping && onTyping(data)
      },
      () => {
        setStreaming(false)
      }
    )
  }, [conversationId])

  const sendMessage = useCallback((content) => {
    setStreaming(true)
    setStreamingContent('')
    chatSocket.sendMessage(conversationId, content)
  }, [conversationId])

  const sendTyping = useCallback(() => {
    chatSocket.sendTyping(conversationId)
  }, [conversationId])

  const stopGeneration = useCallback(() => {
    chatSocket.stopGeneration(conversationId)
    setStreaming(false)
  }, [conversationId])

  useEffect(() => {
    if (conversationId) {
      subscribe()
    }
    return () => disconnect()
  }, [conversationId, subscribe, disconnect])

  return {
    messages,
    typing,
    streaming,
    streamingContent,
    sendMessage,
    sendTyping,
    stopGeneration,
    connect,
    disconnect,
  }
}

export default useLiveChat