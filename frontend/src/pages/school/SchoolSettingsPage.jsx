import React, { useState, useEffect } from 'react'
import { useToast } from '../../hooks/useToast'
import LoadingIndicator from '../../components/LoadingIndicator'

export default function SchoolSettingsPage() {
  const { success: showToast } = useToast()
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const update = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      showToast('Institutional configuration saved successfully!')
    }, 600)
  }

  if (loading) {
    return <LoadingIndicator message="Loading school settings..." />
  }

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: 'bi-calendar-check', desc: 'Auto-marking & grace period' },
    { id: 'ai', label: 'AI Intelligence', icon: 'bi-robot', desc: 'Student limits & permissions' },
    { id: 'assignments', label: 'Assignments', icon: 'bi-card-text', desc: 'Late penalties & upload sizes' },
    { id: 'exams', label: 'Exams & Quizzes', icon: 'bi-file-earmark-text', desc: 'Passing thresholds & attempts' },
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell', desc: 'Email, SMS & push channels' },
    { id: 'theme', label: 'Branding & Theme', icon: 'bi-palette', desc: 'Colors & typography' },
  ]

  return (
    <div className="container-fluid p-0 animate-fade">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>School Settings</h3>
          <p className="text-muted small m-0">Configure institution-wide academic rules, AI limits, and notification preferences.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Navigation Tabs */}
        <div className="col-lg-3 col-md-4">
          <div className="card border shadow-xs bg-card p-2" style={{ borderRadius: '16px' }}>
            <div className="d-flex flex-column gap-1">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`btn text-start rounded-3 p-2.5 d-flex align-items-center gap-3 border-0 transition-all ${
                      isActive 
                        ? 'btn-primary shadow-xs' 
                        : 'btn-ghost text-body bg-surface-hover'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <div 
                      className={`rounded-3 p-2 d-flex align-items-center justify-content-center ${
                        isActive ? 'bg-white bg-opacity-20 text-white' : 'bg-primary-subtle text-primary'
                      }`}
                      style={{ width: '34px', height: '34px' }}
                    >
                      <i className={`bi ${tab.icon} fs-6`} />
                    </div>
                    <div className="min-width-0 flex-grow-1">
                      <div className="fw-semibold small text-truncate">{tab.label}</div>
                      <div 
                        className={`x-small text-truncate ${isActive ? 'text-white text-opacity-75' : 'text-muted'}`}
                        style={{ fontSize: '11px' }}
                      >
                        {tab.desc}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="col-lg-9 col-md-8">
          <div className="card border shadow-xs bg-card overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="card-header border-bottom py-3 bg-card">
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                <i className={`bi ${tabs.find(t => t.id === activeTab)?.icon} me-2 text-primary`} />
                {tabs.find(t => t.id === activeTab)?.label} Configuration
              </h5>
            </div>

            <div className="card-body p-4">
              {/* Attendance Settings */}
              {activeTab === 'attendance' && (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Auto-Mark Attendance</div>
                      <small className="text-muted">Automatically mark students present when they log in to the portal</small>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={settings.attendance.autoMark} 
                        onChange={e => update('attendance', 'autoMark', e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Grace Period (minutes)</div>
                      <small className="text-muted">Allowed late arrival window before marking as tardy or absent</small>
                    </div>
                    <input 
                      type="number" 
                      className="form-control bg-surface border" 
                      style={{ width: '120px' }} 
                      value={settings.attendance.gracePeriod} 
                      onChange={e => update('attendance', 'gracePeriod', parseInt(e.target.value) || 0)} 
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Notify Absent Students & Parents</div>
                      <small className="text-muted">Send automated SMS/email alerts when student is marked absent</small>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={settings.attendance.notifyAbsent} 
                        onChange={e => update('attendance', 'notifyAbsent', e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* AI Features */}
              {activeTab === 'ai' && (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Enable AI Assistant Platform-wide</div>
                      <small className="text-muted">Allow teachers and administrators to generate quizzes and lesson plans</small>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={settings.ai.enabled} 
                        onChange={e => update('ai', 'enabled', e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Allow Student AI Tutor</div>
                      <small className="text-muted">Grant students access to interactive AI homework tutoring</small>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={settings.ai.allowStudents} 
                        onChange={e => update('ai', 'allowStudents', e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Daily AI Query Limit Per User</div>
                      <small className="text-muted">Maximum number of AI prompts per student per calendar day</small>
                    </div>
                    <input 
                      type="number" 
                      className="form-control bg-surface border" 
                      style={{ width: '120px' }} 
                      value={settings.ai.dailyLimit} 
                      onChange={e => update('ai', 'dailyLimit', parseInt(e.target.value) || 0)} 
                    />
                  </div>
                </div>
              )}

              {/* Assignments */}
              {activeTab === 'assignments' && (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Allow Late Submissions</div>
                      <small className="text-muted">Allow students to submit work after the scheduled deadline</small>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={settings.assignments.allowLateSubmission} 
                        onChange={e => update('assignments', 'allowLateSubmission', e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Late Penalty (% deduction)</div>
                      <small className="text-muted">Automatic percentage deducted per day for late assignments</small>
                    </div>
                    <input 
                      type="number" 
                      className="form-control bg-surface border" 
                      style={{ width: '120px' }} 
                      value={settings.assignments.latePenalty} 
                      onChange={e => update('assignments', 'latePenalty', parseInt(e.target.value) || 0)} 
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Max File Size (MB)</div>
                      <small className="text-muted">Maximum attachment file size allowed per student submission</small>
                    </div>
                    <input 
                      type="number" 
                      className="form-control bg-surface border" 
                      style={{ width: '120px' }} 
                      value={settings.assignments.maxFileSize} 
                      onChange={e => update('assignments', 'maxFileSize', parseInt(e.target.value) || 0)} 
                    />
                  </div>
                </div>
              )}

              {/* Exams */}
              {activeTab === 'exams' && (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Minimum Passing Marks (%)</div>
                      <small className="text-muted">Standard institutional passing threshold for tests and quizzes</small>
                    </div>
                    <input 
                      type="number" 
                      className="form-control bg-surface border" 
                      style={{ width: '120px' }} 
                      value={settings.exams.passingMarks} 
                      onChange={e => update('exams', 'passingMarks', parseInt(e.target.value) || 0)} 
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Max Practice Attempts</div>
                      <small className="text-muted">Allowed retry attempts for formative practice quizzes</small>
                    </div>
                    <input 
                      type="number" 
                      className="form-control bg-surface border" 
                      style={{ width: '120px' }} 
                      value={settings.exams.maxAttempts} 
                      onChange={e => update('exams', 'maxAttempts', parseInt(e.target.value) || 0)} 
                    />
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Email Notifications</div>
                      <small className="text-muted">Send automated grade cards and attendance reports via email</small>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={settings.notifications.emailEnabled} 
                        onChange={e => update('notifications', 'emailEnabled', e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>SMS Alerts</div>
                      <small className="text-muted">Send urgent alerts and emergency notices to parent phone numbers</small>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={settings.notifications.smsEnabled} 
                        onChange={e => update('notifications', 'smsEnabled', e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Browser Push Notifications</div>
                      <small className="text-muted">Instant web alerts for real-time exam reminders and chat messages</small>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={settings.notifications.pushEnabled} 
                        onChange={e => update('notifications', 'pushEnabled', e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Branding & Theme */}
              {activeTab === 'theme' && (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Institutional Primary Color</div>
                      <small className="text-muted">Brand accent color used across portal navigation and badges</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <input 
                        type="color" 
                        value={settings.theme.primaryColor} 
                        onChange={e => update('theme', 'primaryColor', e.target.value)} 
                        style={{ width: '44px', height: '36px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }} 
                      />
                      <code className="bg-surface px-2 py-1 rounded border">{settings.theme.primaryColor}</code>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Font Family</div>
                      <small className="text-muted">Primary typographic typeface for administrative reports</small>
                    </div>
                    <select 
                      className="form-select bg-surface border" 
                      style={{ width: '180px' }} 
                      value={settings.theme.fontFamily} 
                      onChange={e => update('theme', 'fontFamily', e.target.value)}
                    >
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Poppins</option>
                      <option>Outfit</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Save Footer Bar */}
              <div className="d-flex justify-content-end gap-2 pt-4 mt-4 border-top">
                <button 
                  type="button" 
                  className="btn btn-primary rounded-3 px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}