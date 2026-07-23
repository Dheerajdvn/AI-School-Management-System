import React, { useState, useEffect } from 'react'

export default function SchoolSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    attendance: { autoMark: true, gracePeriod: 15, notifyAbsent: true },
    ai: { enabled: true, allowStudents: false, dailyLimit: 50 },
    assignments: { allowLateSubmission: true, latePenalty: 10, maxFileSize: 10 },
    exams: { passingMarks: 40, maxAttempts: 3 },
    notifications: { emailEnabled: true, smsEnabled: false, pushEnabled: true },
    theme: { primaryColor: '#3b82f6', secondaryColor: '#8b5cf6', fontFamily: 'Inter' },
  })
  const [activeTab, setActiveTab] = useState('attendance')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const update = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }))
    setSuccess(false)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 800)
  }

  if (loading) {
    return (
      <div className="ssp-page">
        <div className="skeleton-tabs">{[...Array(5)].map((_, i) => <div key={i} className="skeleton-tab" />)}</div>
        <div className="skeleton-content" />
        <style>{sspStyles}</style>
      </div>
    )
  }

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: 'bi-calendar-check' },
    { id: 'ai', label: 'AI Features', icon: 'bi-robot' },
    { id: 'assignments', label: 'Assignments', icon: 'bi-card-text' },
    { id: 'exams', label: 'Exams', icon: 'bi-file-earmark-text' },
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
    { id: 'theme', label: 'Theme & Colors', icon: 'bi-palette' },
  ]

  return (
    <div className="ssp-page">
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2" />Settings saved successfully.
          <button type="button" className="btn-close" onClick={() => setSuccess(false)} />
        </div>
      )}

      <div className="settings-layout">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button key={tab.id} className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <i className={`bi ${tab.icon}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {/* Attendance Settings */}
          {activeTab === 'attendance' && (
            <div className="settings-section">
              <h5><i className="bi bi-calendar-check me-2" />Attendance Settings</h5>
              <div className="setting-item">
                <div><strong>Auto-Mark Attendance</strong><p className="mb-0 opacity-75">Automatically mark students present when they log in</p></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.attendance.autoMark} onChange={e => update('attendance', 'autoMark', e.target.checked)} /></div>
              </div>
              <div className="setting-item">
                <div><strong>Grace Period (minutes)</strong><p className="mb-0 opacity-75">Late arrival grace period before marking absent</p></div>
                <input type="number" className="form-control" style={{ width: '120px' }} value={settings.attendance.gracePeriod} onChange={e => update('attendance', 'gracePeriod', parseInt(e.target.value))} />
              </div>
              <div className="setting-item">
                <div><strong>Notify Absent Students</strong><p className="mb-0 opacity-75">Send notification when student is marked absent</p></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.attendance.notifyAbsent} onChange={e => update('attendance', 'notifyAbsent', e.target.checked)} /></div>
              </div>
            </div>
          )}

          {/* AI Features */}
          {activeTab === 'ai' && (
            <div className="settings-section">
              <h5><i className="bi bi-robot me-2" />AI Features</h5>
              <div className="setting-item">
                <div><strong>Enable AI Features</strong><p className="mb-0 opacity-75">Allow AI-powered features across the school</p></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.ai.enabled} onChange={e => update('ai', 'enabled', e.target.checked)} /></div>
              </div>
              <div className="setting-item">
                <div><strong>Allow Students to Use AI</strong><p className="mb-0 opacity-75">Students can access AI assistant</p></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.ai.allowStudents} onChange={e => update('ai', 'allowStudents', e.target.checked)} /></div>
              </div>
              <div className="setting-item">
                <div><strong>Daily AI Request Limit</strong><p className="mb-0 opacity-75">Maximum AI requests per day per user</p></div>
                <input type="number" className="form-control" style={{ width: '120px' }} value={settings.ai.dailyLimit} onChange={e => update('ai', 'dailyLimit', parseInt(e.target.value))} />
              </div>
            </div>
          )}

          {/* Assignment Rules */}
          {activeTab === 'assignments' && (
            <div className="settings-section">
              <h5><i className="bi bi-card-text me-2" />Assignment Rules</h5>
              <div className="setting-item">
                <div><strong>Allow Late Submission</strong><p className="mb-0 opacity-75">Students can submit after due date with penalty</p></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.assignments.allowLateSubmission} onChange={e => update('assignments', 'allowLateSubmission', e.target.checked)} /></div>
              </div>
              <div className="setting-item">
                <div><strong>Late Penalty (%)</strong><p className="mb-0 opacity-75">Percentage deduction for late submissions</p></div>
                <input type="number" className="form-control" style={{ width: '120px' }} value={settings.assignments.latePenalty} onChange={e => update('assignments', 'latePenalty', parseInt(e.target.value))} />
              </div>
              <div className="setting-item">
                <div><strong>Max File Size (MB)</strong><p className="mb-0 opacity-75">Maximum attachment file size</p></div>
                <input type="number" className="form-control" style={{ width: '120px' }} value={settings.assignments.maxFileSize} onChange={e => update('assignments', 'maxFileSize', parseInt(e.target.value))} />
              </div>
            </div>
          )}

          {/* Exam Rules */}
          {activeTab === 'exams' && (
            <div className="settings-section">
              <h5><i className="bi bi-file-earmark-text me-2" />Exam Rules</h5>
              <div className="setting-item">
                <div><strong>Passing Marks (%)</strong><p className="mb-0 opacity-75">Minimum marks required to pass</p></div>
                <input type="number" className="form-control" style={{ width: '120px' }} value={settings.exams.passingMarks} onChange={e => update('exams', 'passingMarks', parseInt(e.target.value))} />
              </div>
              <div className="setting-item">
                <div><strong>Max Attempts</strong><p className="mb-0 opacity-75">Maximum re-exam attempts allowed</p></div>
                <input type="number" className="form-control" style={{ width: '120px' }} value={settings.exams.maxAttempts} onChange={e => update('exams', 'maxAttempts', parseInt(e.target.value))} />
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h5><i className="bi bi-bell me-2" />Notification Settings</h5>
              <div className="setting-item">
                <div><strong>Email Notifications</strong><p className="mb-0 opacity-75">Send email notifications to users</p></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.notifications.emailEnabled} onChange={e => update('notifications', 'emailEnabled', e.target.checked)} /></div>
              </div>
              <div className="setting-item">
                <div><strong>SMS Notifications</strong><p className="mb-0 opacity-75">Send SMS alerts for important events</p></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.notifications.smsEnabled} onChange={e => update('notifications', 'smsEnabled', e.target.checked)} /></div>
              </div>
              <div className="setting-item">
                <div><strong>Push Notifications</strong><p className="mb-0 opacity-75">Browser push notifications</p></div>
                <div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={settings.notifications.pushEnabled} onChange={e => update('notifications', 'pushEnabled', e.target.checked)} /></div>
              </div>
            </div>
          )}

          {/* Theme */}
          {activeTab === 'theme' && (
            <div className="settings-section">
              <h5><i className="bi bi-palette me-2" />Theme & Colors</h5>
              <div className="setting-item">
                <div><strong>Primary Color</strong></div>
                <div className="d-flex align-items-center gap-2">
                  <input type="color" value={settings.theme.primaryColor} onChange={e => update('theme', 'primaryColor', e.target.value)} style={{ width: '50px', height: '38px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  <code>{settings.theme.primaryColor}</code>
                </div>
              </div>
              <div className="setting-item">
                <div><strong>Secondary Color</strong></div>
                <div className="d-flex align-items-center gap-2">
                  <input type="color" value={settings.theme.secondaryColor} onChange={e => update('theme', 'secondaryColor', e.target.value)} style={{ width: '50px', height: '38px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  <code>{settings.theme.secondaryColor}</code>
                </div>
              </div>
              <div className="setting-item">
                <div><strong>Font Family</strong></div>
                <select className="form-select" style={{ width: '200px' }} value={settings.theme.fontFamily} onChange={e => update('theme', 'fontFamily', e.target.value)}>
                  <option>Inter</option><option>Roboto</option><option>Poppins</option><option>Open Sans</option>
                </select>
              </div>
            </div>
          )}

          <div className="save-bar">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : <><i className="bi bi-check-lg me-1" />Save Settings</>}
            </button>
          </div>
        </div>
      </div>

      <style>{sspStyles}</style>
    </div>
  )
}

const sspStyles = `
.ssp-page .skeleton-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.ssp-page .skeleton-tab { width: 140px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.ssp-page .skeleton-content { height: 400px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.ssp-page .settings-layout { display: flex; gap: 1.5rem; min-height: 500px; }
.ssp-page .settings-sidebar { width: 240px; flex-shrink: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.ssp-page .settings-tab { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: inherit; text-align: left; transition: all 0.2s; cursor: pointer; font-size: 0.9rem; }
.ssp-page .settings-tab:hover { background: rgba(255,255,255,0.08); }
.ssp-page .settings-tab.active { background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2)); border-color: rgba(59,130,246,0.4); }
.ssp-page .settings-content { flex: 1; background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; }
.ssp-page .settings-section h5 { font-weight: 700; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.ssp-page .setting-item { display: flex; align-items: flex-start; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 1rem; }
.ssp-page .setting-item:last-child { border-bottom: none; }
.ssp-page .setting-item div:first-child { flex: 1; }
.ssp-page .setting-item strong { font-weight: 600; }
.ssp-page .setting-item p { margin: 0.25rem 0 0; font-size: 0.8rem; }
.ssp-page .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; padding: 0.5rem 0.75rem; }
.ssp-page .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.ssp-page .form-check-input { width: 2.5em; height: 1.2em; cursor: pointer; }
.ssp-page .save-bar { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: flex-end; }
.ssp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; padding: 0.6rem 1.5rem; }
.ssp-page code { background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 4px; font-size: 0.85rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`