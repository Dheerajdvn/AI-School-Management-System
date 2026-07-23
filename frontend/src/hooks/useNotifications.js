import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToastContext } from '../context/ToastContext'
import { notificationSocket } from '../services/notificationSocket'

export function useNotifications() {
  const { user } = useAuth()
  const { success, info } = useToastContext()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const connect = useCallback(() => {
    if (user) {
      notificationSocket.connect(user.id, user.roles?.[0])
    }
  }, [user])

  const disconnect = useCallback(() => {
    notificationSocket.disconnect()
  }, [])

  useEffect(() => {
    const handleNotification = (event) => {
      const { notification, handler } = event.detail
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      // Show toast notification
      info(notification.message || notification.title)
    }

    window.addEventListener('notification', handleNotification)
    connect()
    
    return () => {
      window.removeEventListener('notification', handleNotification)
      disconnect()
    }
  }, [connect, disconnect, info])

  const markAsRead = useCallback((notificationId) => {
    notificationSocket.markAsRead(notificationId)
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    connect,
    disconnect,
  }
}

export default useNotifications