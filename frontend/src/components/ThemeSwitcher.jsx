import React from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  const themes = [
    {
      id: 'light',
      title: 'Light Theme',
      subtitle: 'Clean & high-contrast daylight aesthetic',
      icon: 'bi-sun-fill',
      iconColor: '#d97706',
      bgPreview: '#f8fafc',
      cardPreview: '#ffffff',
      borderPreview: '#e2e8f0',
      textPreview: '#1e293b'
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      subtitle: 'Obsidian pitch-black & sleek modern aesthetic',
      icon: 'bi-moon-stars-fill',
      iconColor: '#6366f1',
      bgPreview: '#000000',
      cardPreview: '#0D0D10',
      borderPreview: 'rgba(255, 255, 255, 0.10)',
      textPreview: '#F4F4F5'
    }
  ]

  return (
    <div className="card border shadow-xs bg-card overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom py-3 bg-card">
        <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
          <i className="bi bi-palette me-2 text-primary" />
          Appearance & Theme
        </h5>
        <p className="text-muted small mb-0 mt-1">
          Customize the visual interface and display mode to your preference.
        </p>
      </div>

      <div className="card-body p-4">
        <div className="row g-3">
          {themes.map((t) => {
            const isSelected = theme === t.id
            return (
              <div className="col-md-6" key={t.id}>
                <div
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-4 border cursor-pointer position-relative transition-all h-100 d-flex flex-column justify-content-between ${
                    isSelected ? 'border-primary shadow-xs' : 'border-secondary border-opacity-20'
                  }`}
                  style={{
                    backgroundColor: 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'translateY(-2px)' : 'none'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: `${t.iconColor}15`,
                            color: t.iconColor,
                            width: '36px',
                            height: '36px'
                          }}
                        >
                          <i className={`bi ${t.icon} fs-5`} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0" style={{ color: 'var(--text)', fontSize: '14px' }}>
                            {t.title}
                          </h6>
                          <small className="text-muted" style={{ fontSize: '11px' }}>
                            {t.subtitle}
                          </small>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="badge bg-primary rounded-pill px-2 py-1 small">
                          <i className="bi bi-check2 me-1" /> Active
                        </span>
                      )}
                    </div>

                    {/* Miniature UI Preview */}
                    <div
                      className="p-3 rounded-3 border mb-2"
                      style={{
                        backgroundColor: t.bgPreview,
                        borderColor: t.borderPreview
                      }}
                    >
                      <div
                        className="p-2 rounded-2 border d-flex align-items-center justify-content-between"
                        style={{
                          backgroundColor: t.cardPreview,
                          borderColor: t.borderPreview
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle"
                            style={{ width: '12px', height: '12px', backgroundColor: t.iconColor }}
                          />
                          <div
                            style={{
                              width: '40px',
                              height: '6px',
                              backgroundColor: t.textPreview,
                              borderRadius: '3px',
                              opacity: 0.7
                            }}
                          />
                        </div>
                        <div
                          style={{
                            width: '24px',
                            height: '6px',
                            backgroundColor: '#6366f1',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm w-100 rounded-3 mt-2 fw-medium ${
                      isSelected ? 'btn-primary' : 'btn-secondary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setTheme(t.id)
                    }}
                  >
                    {isSelected ? 'Currently Selected' : `Switch to ${t.title}`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ThemeSwitcher