import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DemoModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const dialogRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  const accounts = [
    { role: 'School Admin', username: 'admin', desc: 'Full school administration, settings, and audit logs', badge: 'ROLE_ADMIN' },
    { role: 'Teacher', username: 'teacher', desc: 'Course creation, AI lesson plans, and assignment grading', badge: 'ROLE_TEACHER' },
    { role: 'Student', username: 'student', desc: '24/7 AI tutor chat, course study materials, and homework submission', badge: 'ROLE_STUDENT' }
  ]

  useEffect(() => {
    if (!isOpen) return undefined

    previouslyFocusedRef.current = document.activeElement
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusable = dialogRef.current?.querySelectorAll(focusableSelector)
    focusable?.[0]?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = Array.from(dialogRef.current.querySelectorAll(focusableSelector))
        .filter((element) => !element.hasAttribute('disabled'))

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previouslyFocusedRef.current?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelectRole = (username) => {
    onClose()
    navigate('/login', { state: { prefillUser: username } })
  }

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '520px' }}>
        <div
          ref={dialogRef}
          className="modal-content border shadow-lg animate-scale-in"
          style={{
            background: 'var(--home-card-bg, var(--surface))',
            color: 'var(--home-text, var(--text))',
            borderColor: 'var(--home-border, var(--border))',
            borderRadius: '18px'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          aria-describedby="demo-modal-description"
        >
          <div className="modal-header border-bottom" style={{ borderColor: 'var(--home-border, var(--border))' }}>
            <h5 id="demo-modal-title" className="modal-title fw-bold" style={{ color: 'var(--home-heading, var(--text))' }}>Select a Demo Role</h5>
            <button type="button" onClick={onClose} className="btn-close" aria-label="Close demo role dialog"></button>
          </div>
          <div className="modal-body p-4">
            <p id="demo-modal-description" className="small text-muted mb-3">
              Choose a role to preview its login flow.
            </p>
            <div className="d-flex flex-column gap-2">
              {accounts.map(acc => (
                <button
                  key={acc.username}
                  onClick={() => handleSelectRole(acc.username)}
                  className="p-3 rounded-3 border text-start w-100 transition-all landing-inner-box d-flex align-items-center justify-content-between"
                  style={{ textDecoration: 'none' }}
                >
                  <div>
                    <div className="fw-semibold d-flex align-items-center gap-2" style={{ color: 'var(--home-heading, var(--text))' }}>
                      <span>{acc.role}</span>
                      <span className="badge bg-primary-subtle text-primary border">{acc.badge}</span>
                    </div>
                    <div className="small text-muted mt-1">{acc.desc}</div>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
