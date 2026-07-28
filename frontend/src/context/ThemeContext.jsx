import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
})

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || localStorage.getItem('theme') || 'light'
  })

  const location = useLocation()

  useEffect(() => {
    // Check if the current page is one of the public dark-only pages (home or login)
    const isPublicDarkOnlyPage = location.pathname === '/' || location.pathname === '/login'
    const activeTheme = isPublicDarkOnlyPage ? 'dark' : theme

    localStorage.setItem('app_theme', theme)
    document.documentElement.setAttribute('data-theme', activeTheme)
    
    if (activeTheme === 'dark') {
      document.body.classList.add('dark-mode')
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
      document.body.classList.remove('dark-mode')
    }
  }, [theme, location.pathname])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
