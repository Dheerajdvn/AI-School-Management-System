import React, { useState, useRef, useEffect, useCallback } from 'react'
import ragApi from '../api/ragApi'
import ChatSidebar from '../components/ChatSidebar'
import ChatMessage from '../components/ChatMessage'
import ErrorBanner from '../components/ErrorBanner'

/**
 * Enterprise RAG Assistant Chat Page with Progressive SSE Token Streaming.
 */
export default function ChatPage() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hi! I'm your RAG-powered Enterprise AI Assistant. Ask me questions about any uploaded documents, courses, or study materials."
    }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')

  const bottomRef = useRef(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

  const createNewConversation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    const newId = generateId()
    const newConversation = {
      id: newId,
      title: 'New Conversation',
      messages: [{
        id: generateId(),
        role: 'assistant',
        content: "Hi! I'm your RAG-powered Enterprise AI Assistant. Ask me questions about any uploaded documents."
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setConversations(prev => [newConversation, ...prev])
    setActiveConversationId(newId)
    setMessages(newConversation.messages)
    setStreaming(false)
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

  const renameConversation = useCallback((id, newTitle) => {
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, title: newTitle } : c)
    )
  }, [])

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
        id: activeConversationId || generateId(),
        title: titleBase,
        messages: newMessages,
        createdAt: now,
        updatedAt: now
      }, ...prev]
    })
  }, [activeConversationId])

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setStreaming(false)
  }, [])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    setInput('')
    setError('')
    setStreaming(true)

    const userMsgId = generateId()
    const assistantMsgId = generateId()

    const userMessage = { id: userMsgId, role: 'user', content: text }
    const initialAssistantMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      sources: []
    }

    const updatedMessages = [...messages, userMessage, initialAssistantMessage]
    setMessages(updatedMessages)
    saveToConversation(updatedMessages, text)

    const controller = new AbortController()
    abortControllerRef.current = controller

    let fullText = ''

    await ragApi.streamChatSse({
      question: text,
      sessionId: activeConversationId,
      signal: controller.signal,
      onSources: (sourcesData) => {
        setMessages(prev =>
          prev.map(m => m.id === assistantMsgId ? { ...m, sources: sourcesData || [] } : m)
        )
      },
      onToken: (token) => {
        fullText += token
        setMessages(prev =>
          prev.map(m => m.id === assistantMsgId ? { ...m, content: fullText } : m)
        )
      },
      onDone: (doneData) => {
        setStreaming(false)
        abortControllerRef.current = null
      },
      onError: (errMessage) => {
        setStreaming(false)
        setError(errMessage || 'Failed to complete SSE chat stream')
        abortControllerRef.current = null
      }
    })
  }, [input, messages, activeConversationId, streaming, saveToConversation])

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMessage) return

    setInput(lastUserMessage.content)
  }, [messages])

  const clearChat = useCallback(() => {
    stopGeneration()
    setMessages([{
      id: generateId(),
      role: 'assistant',
      content: "Chat cleared. How can I help you today?"
    }])
    setError('')
  }, [stopGeneration])

  return (
    <div className="row g-0 h-100 rounded-4 overflow-hidden shadow-sm border bg-card" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* Sidebar */}
      <div className="col-md-3 col-lg-3 d-none d-md-flex flex-column border-end bg-surface p-0">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={selectConversation}
          onNewChat={createNewConversation}
          onClearAll={clearAllConversations}
          onDeleteConversation={deleteConversation}
          onRenameConversation={renameConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="col-12 col-md-9 col-lg-9 d-flex flex-column h-100 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
              <i className="bi bi-cpu fs-5" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold">Enterprise Streaming RAG Assistant</h5>
              <small className="text-muted">Real-time SSE token stream with Qdrant vector retrieval</small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm d-md-none rounded-pill px-3"
              onClick={createNewConversation}
              title="New Chat"
            >
              <i className="bi bi-plus-lg me-1" /> New
            </button>
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              onClick={clearChat}
              title="Clear Chat"
            >
              <i className="bi bi-trash me-1" /> Clear
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-grow-1 overflow-auto pe-2 mb-3" style={{ maxHeight: 'calc(100vh - 360px)' }}>
          {messages.map((msg, i) => (
            <ChatMessage
              key={msg.id || i}
              role={msg.role}
              content={msg.content}
              sources={msg.sources}
              retrievedChunks={msg.retrievedChunks}
              isStreaming={streaming && i === messages.length - 1}
              onRetry={msg.role === 'assistant' && i === messages.length - 1 && !streaming ? retryLastMessage : undefined}
              onSelectSuggestion={(suggestion) => {
                setInput(suggestion)
              }}
            />
          ))}

          {streaming && (
            <div className="d-flex justify-content-start mb-3">
              <div className="chat-bubble assistant p-3 rounded-4 shadow-sm bg-surface border">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <span className="spinner-border spinner-border-sm text-primary" />
                  <span>AI is streaming token response...</span>
                  <button className="btn btn-sm btn-outline-danger ms-3 py-0 px-2" onClick={stopGeneration} style={{ fontSize: '11px' }}>
                    <i className="bi bi-stop-circle me-1" /> Stop Generation
                  </button>
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
              className="btn btn-sm btn-outline-primary mt-2 rounded-pill px-3"
              onClick={retryLastMessage}
            >
              <i className="bi bi-arrow-clockwise me-1" /> Retry
            </button>
          </div>
        )}

        <div className="d-flex flex-wrap gap-2 mb-3">
          {[
            { text: 'What is covered in the syllabus?', icon: 'bi-journal-text' },
            { text: 'Summarize key lecture notes', icon: 'bi-file-earmark-pdf' },
            { text: 'Explain assignment guidelines', icon: 'bi-clipboard-check' },
            { text: 'How many students are enrolled?', icon: 'bi-people' }
          ].map((item) => (
            <button
              key={item.text}
              className="btn btn-sm border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 shadow-xs hover-shadow transition"
              onClick={() => setInput(item.text)}
              disabled={streaming}
              style={{ 
                fontSize: '0.85rem',
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)'
              }}
            >
              <i className={`bi ${item.icon} text-primary`} />
              <span>{item.text}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden bg-surface border p-1">
          <input
            className="form-control border-0 shadow-none bg-transparent ps-3"
            placeholder="Type your question about uploaded documents..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={streaming}
          />
          {streaming ? (
            <button
              className="btn btn-danger px-4 rounded-3 fw-semibold d-flex align-items-center justify-content-center"
              onClick={stopGeneration}
              title="Stop Generation"
            >
              <i className="bi bi-square-fill me-1" /> Stop
            </button>
          ) : (
            <button
              className="btn btn-primary px-4 rounded-3 fw-semibold d-flex align-items-center justify-content-center"
              onClick={send}
              disabled={!input.trim()}
            >
              <i className="bi bi-send-fill" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
