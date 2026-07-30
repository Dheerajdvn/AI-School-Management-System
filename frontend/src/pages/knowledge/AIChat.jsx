import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { aiChatService } from '../../services/aiService'
import { useToast } from '../../hooks/useToast'

export default function AIChat() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m your AI Knowledge Assistant. I can help you find information from your uploaded documents. What would you like to know?' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { error: showError } = useToast()

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: Date.now(), role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await aiChatService.chat({
        message: input,
        conversationId: 'knowledge-chat',
      })
      
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer || response.content || 'No response received',
        confidence: response.confidence || 0.9,
        sources: response.sources || [],
        chunks: response.retrievedChunks || [],
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      showError('Failed to get AI response: ' + (err.response?.data?.message || err.message))
      const errorResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>AI Knowledge Chat</h2>
        <Link to="/knowledge" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Chat Messages */}
          <div className="card border-0 shadow-sm mb-3" style={{ height: '400px', overflow: 'auto' }}>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={"d-flex " + (msg.role === 'user' ? 'justify-content-end' : 'justify-content-start')}>
                    <div className={"p-3 rounded " + (msg.role === 'user' ? 'bg-primary text-white' : 'bg-light')} style={{ maxWidth: '80%' }}>
                      <p className="mb-0">{msg.content}</p>
                      {msg.sources && (
                        <div className="mt-2 pt-2 border-top">
                          <small><strong>Sources:</strong></small>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {msg.sources.map((source) => (
                              <span key={source} className="badge bg-info">{source}</span>
                            ))}
                          </div>
                          <small className="d-block mt-1"><strong>Confidence:</strong> {(msg.confidence * 100).toFixed(1)}%</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="d-flex justify-content-start">
                    <div className="p-3 rounded bg-light">
                      <div className="spinner-border spinner-border-sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <button className="btn btn-primary" type="submit" disabled={isTyping}>
                <i className="bi bi-send" />
              </button>
            </div>
          </form>
        </div>

        <div className="col-lg-4">
          {/* Suggested Questions */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Suggested Questions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-sm btn-outline-secondary text-start" onClick={() => setInput('What are Newton\'s laws?')}>
                  What are Newton's laws?
                </button>
                <button className="btn btn-sm btn-outline-secondary text-start" onClick={() => setInput('How to solve quadratic equations?')}>
                  How to solve quadratic equations?
                </button>
                <button className="btn btn-sm btn-outline-secondary text-start" onClick={() => setInput('What is photosynthesis?')}>
                  What is photosynthesis?
                </button>
                <button className="btn btn-sm btn-outline-secondary text-start" onClick={() => setInput('Explain the French Revolution')}>
                  Explain the French Revolution
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}