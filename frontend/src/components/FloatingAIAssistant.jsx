import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { aiChatService } from '../services/aiService'
import { AiApi } from '../services/api'

const DESKTOP_WIDTH = 360
const DESKTOP_HEIGHT = 480
const MOBILE_WIDTH = '92vw'

const PUBLIC_SUGGESTIONS = [
  'What solution do you provide?',
  'Who is this for?',
  'How many clients?'
]

const APP_SUGGESTIONS = ['Summarize Syllabus', 'Java OOP Help', 'Generate Quiz']

const PUBLIC_INTENT_RESPONSES = [
  {
    keywords: ['solution', 'provide', 'offer', 'what do you do', 'services', 'platform'],
    answer: 'AI School OS provides a full-stack school management and AI knowledge platform. The solution includes role-based dashboards, student and teacher workflows, assignments, document upload, RAG-powered course-material search, and an AI assistant for education operations.'
  },
  {
    keywords: ['client', 'clients', 'customer', 'customers', 'how many', 'schools using', 'users'],
    answer: 'This website currently presents AI School OS as a product/demo platform. The visible dashboard numbers are sample preview metrics, not verified client counts. For real customer or deployment numbers, please use the demo/login flow or contact the team directly.'
  },
  {
    keywords: ['rag', 'document', 'search', 'qdrant', 'knowledge', 'citation', 'pdf'],
    answer: 'The knowledge solution lets schools upload course documents, extract text, split it into overlapping chunks, create embeddings, store vectors in Qdrant, and retrieve relevant context for AI-generated answers.'
  },
  {
    keywords: ['admin', 'teacher', 'student', 'principal', 'role', 'roles'],
    answer: 'The platform supports role-specific experiences for administrators, principals, teachers, and students. Admins manage school operations, teachers manage coursework and AI-assisted teaching tasks, and students access learning materials, assignments, and AI study support.'
  },
  {
    keywords: ['security', 'auth', 'authentication', 'rbac', 'safe', 'privacy'],
    answer: 'Security features include JWT-based authentication, role-based authorization, audit-log support, and encrypted storage for sensitive provider keys. Public visitors cannot access protected school data through this assistant.'
  },
  {
    keywords: ['demo', 'login', 'try', 'account', 'test'],
    answer: 'You can use the demo accounts from the landing page to preview the authenticated dashboards. The demo flow shows role-specific views for admin, teacher, and student users.'
  }
]

const getPublicAssistantReply = (text) => {
  const question = text.toLowerCase()
  const match = PUBLIC_INTENT_RESPONSES.find(item =>
    item.keywords.some(keyword => question.includes(keyword))
  )

  if (match) return match.answer

  return 'I can help with essential information about AI School OS: what the platform provides, who it is for, its AI/RAG document-search solution, role-based dashboards, security basics, demo access, and client/demo status. For private school data or course-specific AI help, please sign in.'
}

export default function FloatingAIAssistant() {
  const { isAuthenticated } = useAuth()
  const isPublicMode = !isAuthenticated
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

  useEffect(() => {
    try {
      localStorage.removeItem('floating_ai_assistant_pos')
    } catch {
    }
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const resetCollapseTimer = useCallback(() => {
    if (isMobile) return
    setIsExpanded(true)
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
    collapseTimerRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 5000)
  }, [isMobile])

  useEffect(() => {
    if (!isAuthenticated) {
      setIsHealthy(true)
      return undefined
    }

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
  }, [isAuthenticated])

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading, isOpen])

  const openChat = () => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: isPublicMode
          ? "Hello! I can answer essential questions about AI School OS.\n\nAsk me about:\n- What solution we provide\n- Who the platform is for\n- AI/RAG document search\n- Demo access and client status"
          : "Hello! I am your AI Knowledge Assistant. How can I help you today?\n\nAsk me about:\n- Course syllabi and study materials\n- Assignments and grading criteria\n- School management operations\n- Vector knowledge search"
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
            content: getPublicAssistantReply(text)
          }])
          setLoading(false)
        }, 350)
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isPublicMode
          ? getPublicAssistantReply(text)
          : 'I encountered an error communicating with the AI LLM backend. Please try again.'
      }])
    } finally {
      if (isAuthenticated) setLoading(false)
    }
  }, [input, isAuthenticated, isPublicMode])

  const suggestions = isPublicMode ? PUBLIC_SUGGESTIONS : APP_SUGGESTIONS

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1080 }}>
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
          <div
            className="p-3 d-flex justify-content-between align-items-center text-white"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <div className="d-flex align-items-center gap-2">
              <div className="p-1.5 bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                <i className="bi bi-robot text-white fs-6" />
              </div>
              <div>
                <div className="fw-bold small lh-1">EduAI Assistant</div>
                <small className="opacity-75 x-small d-flex align-items-center gap-1">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  {isPublicMode ? 'Website Guide' : (isHealthy ? 'LLM Online' : 'System Ready')}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1">
              <button
                className="btn btn-sm btn-link text-white opacity-75 opacity-100-hover p-1"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand assistant' : 'Minimize assistant'}
              >
                <i className={`bi ${isMinimized ? 'bi-arrows-angle-expand' : 'bi-dash-lg'}`} />
              </button>
              <button
                className="btn btn-sm btn-link text-white opacity-75 opacity-100-hover p-1"
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close assistant"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>

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
                  <div key={`${m.role}-${i}`} className={`d-flex mb-3 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className="p-2.5 rounded-3 max-w-85 shadow-xs"
                      style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.45',
                        borderRadius: '14px',
                        ...(m.role === 'user'
                          ? { backgroundColor: 'var(--primary, #4f46e5)', color: '#ffffff' }
                          : {
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
                      <span>{isPublicMode ? 'Checking product info...' : 'Thinking and parsing vector chunks...'}</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div
                className="px-2 py-1.5 border-top d-flex gap-1.5 overflow-auto no-scrollbar"
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--card, #17181b)',
                  borderColor: 'var(--border, #27272a)'
                }}
              >
                {suggestions.map(q => (
                  <button
                    key={q}
                    className="btn btn-xs btn-outline-primary text-nowrap rounded-pill py-0.5 px-2.5"
                    style={{ fontSize: '10px' }}
                    onClick={() => send(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>

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
                    placeholder={isPublicMode ? 'Ask about our solution...' : 'Ask AI anything...'}
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
                    aria-label="Send message"
                  >
                    <i className="bi bi-send-fill" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          className="btn btn-primary shadow-lg d-flex align-items-center border-0 cursor-pointer overflow-hidden fab-expansion-btn"
          onClick={handleFabClick}
          onMouseEnter={resetCollapseTimer}
          aria-label={isPublicMode ? 'Ask about AI School OS' : 'Open AI assistant'}
          style={{
            backgroundColor: 'var(--primary)',
            boxShadow: '0 8px 28px rgba(var(--primary-rgb), 0.35)',
            height: '60px',
            width: (!isMobile && isExpanded) ? '170px' : '60px',
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
              <span className="text-white">{isPublicMode ? 'Ask Website' : 'Ask AI'}</span>
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
