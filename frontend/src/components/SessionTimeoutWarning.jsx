import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function SessionTimeoutWarning() {
  const { logout } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (authService.isTokenExpiringSoon()) {
        setShowWarning(true)
      }
    }

    const interval = setInterval(checkTokenExpiry, 60000)
    checkTokenExpiry()

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showWarning && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      logout()
    }
  }, [showWarning, countdown, logout])

  const handleExtend = () => {
    authService.refreshAuthToken()
    setShowWarning(false)
    setCountdown(60)
  }

  if (!showWarning) return null

  return (
    <div className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1080 }}>
      <div className="toast show align-items-center bg-warning text-dark">
        <div className="d-flex">
          <div className="toast-body">
            <small>Your session will expire in {countdown} seconds.</small>
          </div>
          <button className="btn btn-sm btn-outline-dark me-2" onClick={handleExtend}>
            Extend
          </button>
        </div>
      </div>
    </div>
  )
}