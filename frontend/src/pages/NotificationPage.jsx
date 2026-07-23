import React, { useState, useEffect } from 'react'
import NotificationList from '../components/NotificationList'
import NotificationFilter from '../components/NotificationFilter'
import LoadingIndicator from '../components/LoadingIndicator'

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Mock data for notifications
  const mockNotifications = [
    { id: 1, type: 'ASSIGNMENT_DUE', title: 'Assignment Due', message: 'Math Assignment is due tomorrow', createdAt: new Date().toISOString(), read: false },
    { id: 2, type: 'GRADE_PUBLISHED', title: 'Grade Published', message: 'Your Science grade has been published', createdAt: new Date().toISOString(), read: true },
    { id: 3, type: 'COURSE_ANNOUNCEMENT', title: 'Course Announcement', message: 'New syllabus available for English course', createdAt: new Date().toISOString(), read: false },
    { id: 4, type: 'DOCUMENT_UPLOADED', title: 'Document Uploaded', message: 'New study material uploaded', createdAt: new Date().toISOString(), read: false },
    { id: 5, type: 'AI_PROCESSING_COMPLETED', title: 'AI Processing Completed', message: 'Your query has been processed', createdAt: new Date().toISOString(), read: true },
  ]

  useEffect(() => {
    loadNotifications()
  }, [filter, page, search])

  const loadNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      // In real implementation, this would call the backend API
      // For now, use mock data
      let filtered = [...mockNotifications]
      
      if (filter === 'unread') {
        filtered = filtered.filter(n => !n.read)
      } else if (filter !== 'all') {
        filtered = filtered.filter(n => n.type === filter)
      }

      if (search) {
        filtered = filtered.filter(n => 
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.message.toLowerCase().includes(search.toLowerCase())
        )
      }

      setNotifications(filtered)
      setTotal(filtered.length)
      setTotalPages(1)
    } catch (e) {
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Notifications</h1>
          <p className="text-muted">Manage your system notifications</p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <NotificationFilter value={filter} onChange={setFilter} />
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search notifications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <NotificationList
        notifications={notifications}
        page={page}
        total={total}
        totalPages={totalPages}
        loading={loading}
        error={error}
        onPageChange={handlePageChange}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default NotificationPage