import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { aiChatService } from '../services/aiService'
import { AiApi } from '../services/api'

const STORAGE_KEY = 'floating_ai_assistant_pos'
const FAB_SIZE = 56
const DESKTOP_WIDTH = 300
const DESKTOP_HEIGHT = 420
const TABLET_WIDTH = 280
const TABLET_HEIGHT = 380

const getIsMobile = () => window.innerWidth < 768
const getIsTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024

export default function FloatingAIAssistant() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(getIsMobile())
  const [isTablet, setIsTablet] = useState(getIsTablet())
  const [typewriterText, setTypewriterText] = useState('')
  const [isHealthy, setIsHealthy] = useState(false)
  const [showPill, setShowPill] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [dragMode, setDragMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef(null)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const [pos, setPos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return { left: parsed.x, top: parsed.y }
        }
      }
    } catch (e) {}
    return null
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile())
      setIsTablet(getIsTablet())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    setDragMode(prev => !prev)
  }

  const handleMouseDown = (e) => {
    if (!dragMode) return
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.floating-ai-messages')) return

    e.preventDefault()
    let currentLeft, currentTop

    if (pos) {
      currentLeft = pos.left
      currentTop = pos.top
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      currentLeft = rect.left
      currentTop = rect.top
    } else {
      currentLeft = window.innerWidth - 324
      currentTop = window.innerHeight - 444
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    dragStartRef.current = {
      x: clientX - currentLeft,
      y: clientY - currentTop
    }

    setIsDragging(true)
    setShowMenu(false)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !dragMode) return

      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY

      const w = isMobile && !isOpen ? FAB_SIZE : (isTablet ? TABLET_WIDTH : DESKTOP_WIDTH)
      const h = isMobile && !isOpen ? FAB_SIZE : (isTablet ? TABLET_HEIGHT : DESKTOP_HEIGHT)

      let newLeft = clientX - dragStartRef.current.x
      let newTop = clientY - dragStartRef.current.y

      // Boundary check
      const maxLeft = Math.max(0, window.innerWidth - w)
      const maxTop = Math.max(0, window.innerHeight - h)

      newLeft = Math.max(0, Math.min(newLeft, maxLeft))
      newTop = Math.max(0, Math.min(newTop, maxTop))

      setPos({ left: newLeft, top: newTop })
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        if (pos) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: pos.left, y: pos.top }))
        }
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleMouseMove)
      window.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, dragMode, pos, isMobile, isTablet, isOpen])

  const handleResetPosition = () => {
    localStorage.removeItem(STORAGE_KEY)
    setPos(null)
    setDragMode(false)
    setShowMenu(false)
  }

  useEffect(() => {
    let isMounted = true
    const checkHealth = async () => {
      try {
        const res = await AiApi.health()
        if (isMounted) {
          setIsHealthy(!!res?.llmAvailable)
        }
      } catch {
        if (isMounted) setIsHealthy(false)
      }
    }
    checkHealth()
    const interval = setInterval(checkHealth, 10000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (isMobile && isOpen) return
    const texts = ['Ask me anything...', 'Need help?', 'Explore AI']
    let idx = 0
    let charIdx = 0
    let deleting = false
    let timer

    const type = () => {
      const cur = texts[idx]
      if (deleting) {
        charIdx = Math.max(0, charIdx - 2)
        setTypewriterText(cur.substring(0, charIdx))
        if (charIdx === 0) {
          deleting = false
          idx = (idx + 1) % texts.length
        }
      } else {
        charIdx = Math.min(cur.length, charIdx + 2)
        setTypewriterText(cur.substring(0, charIdx))
        if (charIdx === cur.length) {
          deleting = true
          timer = setTimeout(type, 1500)
          return
        }
      }
      timer = setTimeout(type, deleting ? 50 : 100)
    }

    if (!isOpen) {
      timer = setTimeout(type, 500)
    }
    return () => clearTimeout(timer)
  }, [isOpen, isMobile])

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current.querySelector('.floating-ai-messages')
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [messages, loading])

  const openChat = () => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hello! I'm EduAI. How can I help you today?\n\nI can answer questions about:\n• This platform\n• School Management\n• Student/Teacher features\n• AI Assistant\n• Courses & Assignments"
      }])
    }
    setShowPill(false)
    setIsOpen(true)
    setIsMinimized(false)
  }

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      if (isAuthenticated) {
        const res = await aiChatService.chat({ message: text })
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: res.answer || res.content || 'No reply.',
          sources: res.sources || []
        }])
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "I'm here to help! Please log in to access the full AI assistant with deep integration into your school data."
          }])
          setLoading(false)
        }, 500)
        return
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }, [input, isAuthenticated])

  const width = isMobile ? FAB_SIZE : isTablet ? TABLET_WIDTH : DESKTOP_WIDTH
  const isMobileFab = isMobile && !isOpen

  const style = {
    position: 'fixed',
    ...(pos ? {
      left: `${pos.left}px`,
      top: `${pos.top}px`
    } : {
      right: '24px',
      bottom: '24px'
    }),
    width: isMobileFab ? `${FAB_SIZE}px` : `${width}px`,
    zIndex: 1080,
    cursor: dragMode ? 'move' : 'default',
    touchAction: 'none'
  }

  return (
    <div
      ref={containerRef}
      style={style}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      title={dragMode ? "Drag Mode Enabled (Double-click to lock)" : "Double-click to enable Drag Mode"}
    >
      {dragMode && (
        <div
          className="position-absolute bg-dark text-white px-2 py-1 rounded shadow small"
          style={{ top: '-30px', right: 0, zIndex: 1095, fontSize: '0.75rem' }}
        >
          <i className="bi bi-arrows-move me-1 text-warning" /> Drag Mode
        </div>
      )}

      {isOpen && (
        <div
          className="shadow-lg bg-white rounded-3 overflow-hidden d-flex flex-column"
          style={{
            width: '100%',
            height: isMobile ? 'calc(100vh - 100px)' : (isTablet ? `${TABLET_HEIGHT}px` : `${DESKTOP_HEIGHT}px`)
          }}
        >
          <div
            className="p-3 d-flex justify-content-between align-items-center text-white"
            style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)' }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-robot fs-5" />
              <strong>EduAI Assistant</strong>
              {dragMode && <span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>Drag Mode</span>}
            </div>
            <div className="d-flex align-items-center gap-1">
              <div className="dropdown" style={{ position: 'relative' }}>
                <button
                  className="btn btn-sm btn-outline-light py-0 px-2"
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  title="Menu"
                >
                  <i className="bi bi-three-dots-vertical" />
                </button>
                {showMenu && (
                  <div className="dropdown-menu show shadow" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1090 }}>
                    <button
                      className="dropdown-item small text-dark d-flex align-items-center gap-1"
                      onClick={(e) => { e.stopPropagation(); handleResetPosition(); }}
                    >
                      <i className="bi bi-arrow-counterclockwise" /> Reset Position
                    </button>
                  </div>
                )}
              </div>
              <button
                className="btn btn-sm btn-outline-light py-0 px-2"
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                <i className={`bi ${isMinimized ? 'bi-arrows-fullscreen' : 'bi-dash-lg'}`} />
              </button>
              <button
                className="btn btn-sm btn-outline-light py-0 px-2"
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); setShowPill(true); }}
                title="Close"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div
                className="floating-ai-messages p-3 flex-grow-1"
                style={{ overflowY: 'auto', maxHeight: 'calc(100% - 120px)' }}
              >
                {messages.map((m, i) => (
                  <div key={i} className={`d-flex mb-2 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className={`p-2 rounded-3 small ${m.role === 'user' ? 'bg-primary text-white' : 'bg-light border'}`}
                      style={{ maxWidth: '85%', whiteSpace: 'pre-wrap' }}
                    >
                      <div className="text-muted mb-1" style={{ fontSize: '0.7rem' }}>
                        {m.role === 'assistant' ? <i className="bi bi-robot" /> : <i className="bi bi-person" />}
                      </div>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="d-flex justify-content-start mb-2">
                    <div className="p-2 rounded-3 bg-light border small text-muted">Thinking...</div>
                  </div>
                )}
              </div>

              <div className="p-2 border-top bg-white">
                <div className="d-flex gap-1">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Type your question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    disabled={loading}
                  />
                  <button className="btn btn-primary btn-sm" onClick={send} disabled={loading || !input.trim()}>
                    <i className="bi bi-send-fill" />
                  </button>
                </div>
              </div>
            </>
          )}

          {isMinimized && (
            <div className="p-3 text-center text-muted small" style={{ cursor: 'pointer' }} onClick={() => setIsMinimized(false)}>
              EduAI minimized - click to expand
            </div>
          )}
        </div>
      )}

      {(!isOpen || showPill) && (
        <button
          className="btn btn-primary shadow-lg d-flex align-items-center gap-2"
          onClick={() => { if (!isDragging) openChat() }}
          style={{
            ...(isMobileFab ? { width: FAB_SIZE, height: FAB_SIZE, borderRadius: '50%', padding: 0, justifyContent: 'center' } : {
              borderRadius: '50px',
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 500
            }),
            cursor: dragMode ? 'move' : 'pointer'
          }}
        >
          <i className="bi bi-robot fs-5" />
          {!isMobileFab && <span className="typewriter-text">{typewriterText}</span>}
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isHealthy ? '#10b981' : '#ef4444',
              boxShadow: isHealthy ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : '0 0 0 4px rgba(239, 68, 68, 0.2)'
            }}
          />
        </button>
      )}
    </div>
  )
}
