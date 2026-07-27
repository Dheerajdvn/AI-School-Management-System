import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { aiChatService } from '../services/aiService'
import { AiApi } from '../services/api'

const DESKTOP_WIDTH = 360
const DESKTOP_HEIGHT = 480
const MOBILE_WIDTH = '92vw'

export default function FloatingAIAssistant() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isHealthy, setIsHealthy] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  const messagesEndRef = useRef(null)
  const collapseTimerRef = useRef(null)

  // Clear legacy drag positions
  useEffect(() => {
    try {
      localStorage.removeItem('floating_ai_assistant_pos')
    } catch (e) {}
  }, [])

  // Window resize handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto Collapse Timer (5 seconds)
  const resetCollapseTimer = useCallback(() => {
    if (isMobile) return // Mobile is always collapsed
    setIsExpanded(true)
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
    collapseTimerRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 5000)
  }, [isMobile])

  // Health Check
  useEffect(() => {
    let isMounted = true
    const checkHealth = async () => {
      try {
        const res = await AiApi.health()
        if (isMounted) setIsHealthy(!!res?.llmAvailable)
      } catch {
        if (isMounted) setIsHealthy(true)
      }
    }
    checkHealth()
    const interval = setInterval(checkHealth, 20000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading, isOpen])

  const openChat = () => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hello! I am your AI Knowledge Assistant. How can I help you today?\n\nAsk me about:\n• Course Syllabi & Study Materials\n• Assignments & Grading Criteria\n• School Management Operations\n• Vector Knowledge Search"
      }])
    }
    setIsOpen(true)
    setIsMinimized(false)
    setIsExpanded(false)
  }

  const handleFabClick = () => {
    if (!isExpanded && !isMobile) {
      resetCollapseTimer()
    } else {
      openChat()
    }
  }

  const send = useCallback(async (customText = null) => {
    const text = (customText || input).trim()
    if (!text) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      if (isAuthenticated) {
        const res = await aiChatService.chat({ message: text })
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: res.answer || res.content || 'I processed your query.',
          sources: res.sources || []
        }])
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Please sign in to unlock real-time vector search across school documents and courses."
          }])
          setLoading(false)
        }, 400)
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error communicating with the AI LLM backend. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }, [input, isAuthenticated])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1080
      }}
    >
      {/* 1. Opaque Solid Chat Dialog Window */}
      {isOpen && (
        <div
          className="shadow-lg border overflow-hidden d-flex flex-column animate-fade-in"
          style={{
            width: window.innerWidth < 480 ? MOBILE_WIDTH : `${DESKTOP_WIDTH}px`,
            height: isMinimized ? '56px' : `${DESKTOP_HEIGHT}px`,
            borderRadius: '16px',
            backgroundColor: 'var(--card, #17181b)',
            borderColor: 'var(--border, #27272a)',
            opacity: 1,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            transition: 'height 0.25s ease'
          }}
        >
          {/* Header */}
          <div
            className="p-3 d-flex justify-content-between align-items-center text-white"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            <div className="d-flex align-items-center gap-2">
              <div className="p-1.5 bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                <i className="bi bi-robot text-white fs-6" />
              </div>
              <div>
                <div className="fw-bold small lh-1">EduAI Assistant</div>
                <small className="opacity-75 x-small d-flex align-items-center gap-1">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  {isHealthy ? 'LLM Online' : 'System Ready'}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1">
              <button
                className="btn btn-sm btn-link text-white opacity-75 opacity-100-hover p-1"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <i className={`bi ${isMinimized ? 'bi-arrows-angle-expand' : 'bi-dash-lg'}`} />
              </button>
              <button
                className="btn btn-sm btn-link text-white opacity-75 opacity-100-hover p-1"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div
                className="floating-ai-messages p-3 flex-grow-1 overflow-auto"
                style={{
                  fontSize: '13px',
                  backgroundColor: 'var(--surface, #111827)',
                  opacity: 1
                }}
              >
                {messages.map((m, i) => (
                  <div key={i} className={`d-flex mb-3 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className="p-2.5 rounded-3 max-w-85 shadow-xs"
                      style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.45',
                        borderRadius: '14px',
                        ...(m.role === 'user' ? {
                          backgroundColor: 'var(--primary, #4f46e5)',
                          color: '#ffffff'
                        } : {
                          backgroundColor: 'var(--hover, #1f2937)',
                          color: 'var(--text, #f3f4f6)',
                          border: '1px solid var(--border, #374151)'
                        })
                      }}
                    >
                      <div className="d-flex align-items-center gap-1 opacity-75 mb-1 x-small fw-semibold">
                        <i className={`bi ${m.role === 'assistant' ? 'bi-robot text-primary' : 'bi-person'}`} />
                        <span>{m.role === 'assistant' ? 'EduAI' : 'You'}</span>
                      </div>
                      {m.content}

                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-2 pt-1 border-top border-white border-opacity-25 x-small opacity-90">
                          <i className="bi bi-link-45deg me-1" />
                          <span>Sources: {m.sources.map(s => s.title || s.filename || s).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="d-flex justify-content-start mb-3">
                    <div
                      className="p-2.5 rounded-3 border small text-muted d-flex align-items-center gap-2"
                      style={{ backgroundColor: 'var(--hover, #1f2937)', borderColor: 'var(--border, #374151)' }}
                    >
                      <span className="spinner-border spinner-border-sm text-primary" />
                      <span>Thinking & parsing vector chunks...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestion Chips */}
              <div
                className="px-2 py-1.5 border-top d-flex gap-1.5 overflow-auto no-scrollbar"
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--card, #17181b)',
                  borderColor: 'var(--border, #27272a)'
                }}
              >
                {['Summarize Syllabus', 'Java OOP Help', 'Generate Quiz'].map(q => (
                  <button
                    key={q}
                    className="btn btn-xs btn-outline-primary text-nowrap rounded-pill py-0.5 px-2.5"
                    style={{ fontSize: '10px' }}
                    onClick={() => send(q)}
                  >
                    + {q}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div
                className="p-2 border-top"
                style={{
                  backgroundColor: 'var(--card, #17181b)',
                  borderColor: 'var(--border, #27272a)'
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    send()
                  }}
                  className="d-flex gap-1.5"
                >
                  <input
                    className="form-control form-control-sm rounded-3 ps-3"
                    placeholder="Ask AI anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    style={{
                      backgroundColor: 'var(--input-bg, #18181b)',
                      color: 'var(--text, #f3f4f6)',
                      borderColor: 'var(--input-border, #27272a)'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm rounded-3 px-3 fw-semibold d-flex align-items-center justify-content-center"
                    disabled={loading || !input.trim()}
                  >
                    <i className="bi bi-send-fill" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Premium Circular AI FAB Button (60px Default, Auto-expands on Hover/Click, 5s Auto-collapse) */}
      {!isOpen && (
        <button
          type="button"
          className="btn btn-primary shadow-lg d-flex align-items-center border-0 cursor-pointer overflow-hidden fab-expansion-btn"
          onClick={handleFabClick}
          onMouseEnter={resetCollapseTimer}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 8px 28px rgba(79, 70, 229, 0.5)',
            height: '60px',
            width: (!isMobile && isExpanded) ? '145px' : '60px',
            borderRadius: '30px',
            padding: (!isMobile && isExpanded) ? '0 18px' : '0',
            justifyContent: (!isMobile && isExpanded) ? 'flex-start' : 'center',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '60px', height: '60px' }}>
            <div className="position-relative d-flex align-items-center justify-content-center">
              <i className="bi bi-robot fs-4 text-white" />
              <span
                className="position-absolute top-0 end-0 translate-middle p-1 bg-success border border-light rounded-circle"
                style={{ width: '8px', height: '8px' }}
              />
            </div>
          </div>

          {!isMobile && isExpanded && (
            <div className="d-flex align-items-center gap-1.5 text-nowrap animate-fade-in pe-2" style={{ fontSize: '14px', fontWeight: '600' }}>
              <span className="text-white">Ask AI</span>
              <i className="bi bi-stars text-warning fs-6" />
            </div>
          )}
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .max-w-85 { max-width: 85%; }
        .animate-fade-in { animation: fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .floating-ai-messages::-webkit-scrollbar {
          width: 6px;
        }
        .floating-ai-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        .floating-ai-messages::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .floating-ai-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
        .fab-expansion-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(79, 70, 229, 0.65) !important;
        }
      `}</style>
    </div>
  )
}
