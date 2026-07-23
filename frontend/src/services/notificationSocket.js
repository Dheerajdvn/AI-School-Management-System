import { websocketService } from './websocketService'
import { useToastContext } from '../context/ToastContext'

let subscription = null
let currentUserId = null
let currentUserRole = null

export const notificationSocket = {
  connect: (userId, role) => {
    currentUserId = userId
    currentUserRole = role
    websocketService.connect(null, null, null, null, () => {
      // Subscribe to role-specific notification channel
      if (role) {
        subscription = websocketService.subscribe(`/user/${role.toLowerCase()}/notifications`, (notification) => {
          notificationSocket.handleNotification(notification)
        })
      }
      // Also subscribe to global notifications for school admins
      if (role === 'SCHOOL_ADMIN') {
        websocketService.subscribe(`/user/school/${userId}/notifications`, (notification) => {
          notificationSocket.handleNotification(notification)
        })
      }
      // Super admin gets all notifications
      if (role === 'SUPER_ADMIN') {
        websocketService.subscribe('/topic/notifications', (notification) => {
          notificationSocket.handleNotification(notification)
        })
      }
    })
  },

  disconnect: () => {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
    websocketService.disconnect()
  },

  subscribe: (callback) => {
    if (subscription) {
      subscription.unsubscribe()
    }
    subscription = websocketService.subscribe(`/user/${currentUserRole?.toLowerCase()}/notifications`, callback)
  },

  handleNotification: (notification) => {
    // This will be called from components with access to toast context
    // Notification format: { type, title, message, data, timestamp }
    const handlers = {
      ASSIGNMENT_PUBLISHED: { icon: 'bi-journal-text', color: 'primary' },
      EXAM_SCHEDULED: { icon: 'bi-calendar-event', color: 'warning' },
      EXAM_RESULTS: { icon: 'bi-graph-up', color: 'info' },
      DOCUMENT_INDEXED: { icon: 'bi-file-check', color: 'success' },
      TEACHER_ANNOUNCEMENT: { icon: 'bi-megaphone', color: 'primary' },
      SCHOOL_ANNOUNCEMENT: { icon: 'bi-megaphone-fill', color: 'info' },
      AI_PROCESSING_COMPLETED: { icon: 'bi-cpu', color: 'success' },
    }

    const handler = handlers[notification.type] || { icon: 'bi-bell', color: 'secondary' }
    // Store for consumption by hooks
    window.dispatchEvent(new CustomEvent('notification', { detail: { notification, handler } }))
  },

  markAsRead: (notificationId) => {
    websocketService.publish(`/app/notification.read`, { notificationId })
  },
}

export default notificationSocket