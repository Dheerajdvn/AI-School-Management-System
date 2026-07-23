import React, { useState, useEffect } from 'react'

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-palette me-2" />
          Theme
        </h5>
      </div>
      <div className="card-body">
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="themeSwitch"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <label className="form-check-label" htmlFor="themeSwitch">
            {theme === 'light' ? (
              <>
                <i className="bi bi-sun-fill me-1" />
                Light Theme
              </>
            ) : (
              <>
                <i className="bi bi-moon-fill me-1" />
                Dark Theme
              </>
            )}
          </label>
        </div>
        <p className="text-muted small mt-2 mb-0">
          Choose between light and dark mode for the application interface.
        </p>
      </div>
    </div>
  )
}

export default ThemeSwitcher