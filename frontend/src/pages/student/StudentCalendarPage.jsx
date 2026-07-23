import React, { useState, useEffect } from 'react'

export default function StudentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents([
        { id: 1, date: '2026-07-28', title: 'Math Assignment Due', type: 'assignment', color: '#f59e0b' },
        { id: 2, date: '2026-07-30', title: 'Physics Lab Report Due', type: 'assignment', color: '#f59e0b' },
        { id: 3, date: '2026-08-01', title: 'English Essay Due', type: 'assignment', color: '#f59e0b' },
        { id: 4, date: '2026-08-05', title: 'Mid-term Exam', type: 'exam', color: '#ef4444' },
        { id: 5, date: '2026-08-10', title: 'Sports Day', type: 'event', color: '#10b981' },
        { id: 6, date: '2026-08-15', title: 'Independence Day', type: 'event', color: '#10b981' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const [loading, setLoading] = useState(true)

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  if (loading) {
    return (
      <div className="cp-page">
        <div className="skeleton-row" />
        <style>{cpStyles}</style>
      </div>
    )
  }

  return (
    <div className="cp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-calendar me-2" />Calendar</h4>
      </div>

      <div className="glass-card">
        <div className="card-header-custom">
          <button className="btn btn-sm btn-outline-primary" onClick={prevMonth}><i className="bi bi-chevron-left" /></button>
          <h5>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h5>
          <button className="btn btn-sm btn-outline-primary" onClick={nextMonth}><i className="bi bi-chevron-right" /></button>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
          {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="calendar-day empty" />)}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDate(day)
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()
            return (
              <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                <span className="day-number">{day}</span>
                {dayEvents.map(ev => <div key={ev.id} className="calendar-event" style={{ borderLeftColor: ev.color }}><span>{ev.title}</span></div>)}
              </div>
            )
          })}
        </div>
      </div>

      <div className="legend mt-3">
        <span className="legend-item"><span className="legend-color" style={{ background: '#f59e0b' }} />Assignment</span>
        <span className="legend-item"><span className="legend-color" style={{ background: '#ef4444' }} />Exam</span>
        <span className="legend-item"><span className="legend-color" style={{ background: '#10b981' }} />Event</span>
      </div>

      <style>{cpStyles}</style>
    </div>
  )
}

const cpStyles = `
.cp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.cp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.cp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.cp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.cp-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.cp-page .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: rgba(255,255,255,0.05); }
.cp-page .calendar-day-header { padding: 0.75rem; text-align: center; font-weight: 600; font-size: 0.85rem; background: rgba(255,255,255,0.04); }
.cp-page .calendar-day { min-height: 100px; padding: 0.5rem; background: rgba(255,255,255,0.02); border-radius: 0; }
.cp-page .calendar-day.empty { background: rgba(255,255,255,0.01); }
.cp-page .calendar-day.today { background: rgba(59,130,246,0.1); }
.cp-page .day-number { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; }
.cp-page .calendar-day.today .day-number { background: #3b82f6; color: white; }
.cp-page .calendar-event { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.06); border-left: 3px solid; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cp-page .legend { display: flex; gap: 1rem; align-items: center; }
.cp-page .legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; opacity: 0.8; }
.cp-page .legend-color { width: 12px; height: 12px; border-radius: 3px; }
.cp-page .skeleton-row { height: 400px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`