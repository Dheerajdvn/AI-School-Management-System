import React, { useEffect, useRef } from 'react'

export default function LandingBgCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    let w = 0
    let h = 0
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // 120-200 small glowing star particles (Theme-adaptive colors & radial glow)
    const particleCount = Math.min(160, Math.max(120, Math.floor(w / 8)))
    const darkColors = ['248, 248, 250', '91, 140, 255', '139, 124, 255', '245, 158, 11']
    const lightColors = ['71, 85, 105', '99, 102, 241', '124, 58, 237', '217, 119, 6']

    const particles = Array.from({ length: particleCount }, () => {
      const colorIndex = Math.floor(Math.random() * 4)
      return {
        x: Math.random() * (w || 1200),
        y: Math.random() * (h || 800),
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.0 + 0.5,
        colorIndex,
        baseAlpha: Math.random() * 0.2 + 0.12,
        pulseSpeed: Math.random() * 0.015 + 0.003,
        pulsePhase: Math.random() * Math.PI * 2
      }
    })

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const isLight = document.documentElement.getAttribute('data-theme') === 'light' || document.body.classList.contains('light-mode')

      // Radial gradient behind hero section
      if (w > 0 && h > 0) {
        const gradTop = ctx.createRadialGradient(w * 0.5, h * 0.22, 20, w * 0.5, h * 0.22, Math.max(w, h) * 0.55)
        if (isLight) {
          gradTop.addColorStop(0, 'rgba(109, 124, 255, 0.06)')
          gradTop.addColorStop(0.6, 'rgba(255, 255, 255, 0)')
          gradTop.addColorStop(1, 'rgba(255, 255, 255, 0)')
        } else {
          gradTop.addColorStop(0, 'rgba(255, 255, 255, 0.035)')
          gradTop.addColorStop(0.6, 'rgba(0, 0, 0, 0)')
          gradTop.addColorStop(1, 'rgba(0, 0, 0, 0)')
        }
        ctx.fillStyle = gradTop
        ctx.fillRect(0, 0, w, h)
      }

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.pulsePhase += p.pulseSpeed

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.05
        const finalAlpha = Math.min(0.40, Math.max(0.12, currentAlpha))
        const activeColor = isLight ? lightColors[p.colorIndex] : darkColors[p.colorIndex]

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${activeColor}, ${finalAlpha})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  )
}
