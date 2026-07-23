import React, { useState, useRef, useEffect, useCallback } from 'react'
import { RagApi } from '../services/api'
import ChatSidebar from '../components/ChatSidebar'
import ChatMessage from '../components/ChatMessage'
import ErrorBanner from '../components/ErrorBanner'

/**
 * Enhanced ChatPage component with conversation history and RAG support.
 */
export default function ChatPage() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your student analytics assistant. Ask me anything about enrollments, fees, courses, or cities."
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

  const createNewConversation = useCallback(() => {
    const newId = generateId()
    const newConversation = {
      id: newId,
      title: 'New Conversation',
      messages: [{
        role: 'assistant',
        content: "Hi! I'm your student analytics assistant. How can I help you today?"
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setConversations(prev => [newConversation, ...prev])
    setActiveConversationId(newId)
    setMessages(newConversation.messages)
    setError('')
  }, [])

  const selectConversation = useCallback((id) => {
    const conversation = conversations.find(c => c.id === id)
    if (conversation) {
      setActiveConversationId(id)
      setMessages(conversation.messages)
      setError('')
    }
  }, [conversations])

  const deleteConversation = useCallback((id) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConversationId === id) {
      const remaining = conversations.filter(c => c.id !== id)
      if (remaining.length > 0) {
        selectConversation(remaining[0].id)
      } else {
        createNewConversation()
      }
    }
  }, [activeConversationId, conversations, selectConversation, createNewConversation])

  const clearAllConversations = useCallback(() => {
    setConversations([])
    createNewConversation()
  }, [createNewConversation])

  const saveToConversation = useCallback((newMessages, userMessage = null) => {
    const now = new Date()
    const titleBase = userMessage
      ? userMessage.length > 30
        ? userMessage.substring(0, 30) + '...'
        : userMessage
      : 'New Conversation'

    setConversations(prev => {
      const existing = prev.find(c => c.id === activeConversationId)
      if (existing) {
        return prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: newMessages, updatedAt: now, title: titleBase }
            : c
        )
      }
      return [{
        id: activeConversationId,
        title: titleBase,
        messages: newMessages,
        createdAt: now,
        updatedAt: now
      }, ...prev]
    })
  }, [activeConversationId])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text) return

    setInput('')
    setError('')

    const userMessage = { id: generateId(), role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    saveToConversation(newMessages, text)

    setLoading(true)

    try {
      const res = await RagApi.chat(text)

      const assistantMessage = {
        id: generateId(),
        role: 'assistant',
        content: res.answer || 'No reply.',
        sources: res.sources || [],
        confidenceScore: res.confidenceScore,
        retrievedChunks: res.retrievedChunks || [],
        responseTime: res.responseTime
      }

      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)
      saveToConversation(updatedMessages)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [input, messages, activeConversationId, saveToConversation])

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMessage) return

    const filteredMessages = messages.filter((m, i) =>
      !(i === messages.length - 1 && m.role === 'assistant')
    )
    setMessages(filteredMessages)

    setLoading(true)
    setError('')

    try {
      const res = await RagApi.chat(lastUserMessage.content)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.answer || 'No reply.',
        sources: res.sources || [],
        confidenceScore: res.confidenceScore,
        retrievedChunks: res.retrievedChunks || [],
        responseTime: res.responseTime
      }])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [messages])

  const clearChat = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared. How can I help you?"
    }])
    setError('')
  }, [])

  return (
    <div className="row g-0 h-100">
      <div className="col-md-3 col-lg-2 d-none d-md-block border-end h-100">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={selectConversation}
          onNewChat={createNewConversation}
          onClearAll={clearAllConversations}
          onDeleteConversation={deleteConversation}
        />
      </div>

      <div className="col-12 col-md-9 col-lg-10 d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0 d-none d-md-block">AI Assistant Chat</h4>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm d-md-none"
              onClick={createNewConversation}
              title="New Chat"
            >
              <i className="bi bi-plus-lg" />
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={clearChat}
              title="Clear Chat"
              disabled={loading}
            >
              <i className="bi bi-trash me-1" />
              Clear
            </button>
          </div>
        </div>

        <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {messages.map((msg, i) => (
            <ChatMessage
              key={msg.id || i}
              role={msg.role}
              content={msg.content}
              sources={msg.sources}
              retrievedChunks={msg.retrievedChunks}
              onRetry={msg.role === 'assistant' && i === messages.length - 1 ? retryLastMessage : undefined}
            />
          ))}

          {loading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="chat-bubble assistant">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="mb-3">
            <ErrorBanner message={error} />
            <button
              className="btn btn-sm btn-outline-primary mt-2"
              onClick={retryLastMessage}
            >
              <i className="bi bi-arrow-clockwise me-1" />
              Retry
            </button>
          </div>
        )}

        <div className="d-flex flex-wrap gap-1 mb-2">
          {[
            'How many students are there?',
            'What are the top courses?',
            'Average student fee',
            'Students from Pune',
            'Show Java students',
            'Find top 5 cities'
          ].map((q) => (
            <span
              key={q}
              className="suggestion-chip"
              onClick={() => setInput(q)}
            >
              {q}
            </span>
          ))}
        </div>

        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
          />
          <button
            className="btn btn-primary px-4"
            onClick={send}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <i className="bi bi-send-fill" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}