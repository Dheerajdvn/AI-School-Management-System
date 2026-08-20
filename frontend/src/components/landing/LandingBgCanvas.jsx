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
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 }

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

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
    }
    const handleMouseLeave = () => {
      mouse.targetX = -1000
      mouse.targetY = -1000
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Dynamic constellation particles
    const particleCount = Math.min(85, Math.max(50, Math.floor(w / 18)))
    const darkColors = ['99, 102, 241', '139, 92, 246', '236, 72, 153', '59, 130, 246']
    const lightColors = ['99, 102, 241', '124, 58, 237', '219, 39, 119', '37, 99, 235']

    const particles = Array.from({ length: particleCount }, () => {
      const colorIndex = Math.floor(Math.random() * 4)
      return {
        x: Math.random() * (w || 1200),
        y: Math.random() * (h || 800),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.8,
        colorIndex,
        baseAlpha: Math.random() * 0.25 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2
      }
    })

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const isLight = document.documentElement.getAttribute('data-theme') === 'light' || document.body.classList.contains('light-mode')

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08
      mouse.y += (mouse.targetY - mouse.y) * 0.08

      // 1. Ambient Aurora Gradient Mesh
      if (w > 0 && h > 0) {
        // Hero top aurora glow
        const gradTop = ctx.createRadialGradient(w * 0.5, h * 0.18, 50, w * 0.5, h * 0.18, Math.max(w, h) * 0.6)
        if (isLight) {
          gradTop.addColorStop(0, 'rgba(99, 102, 241, 0.08)')
          gradTop.addColorStop(0.4, 'rgba(236, 72, 153, 0.04)')
          gradTop.addColorStop(0.8, 'rgba(255, 255, 255, 0)')
        } else {
          gradTop.addColorStop(0, 'rgba(99, 102, 241, 0.10)')
          gradTop.addColorStop(0.4, 'rgba(139, 92, 246, 0.05)')
          gradTop.addColorStop(0.8, 'rgba(0, 0, 0, 0)')
        }
        ctx.fillStyle = gradTop
        ctx.fillRect(0, 0, w, h)

        // Mouse interactive soft spotlight
        if (mouse.x > 0 && mouse.y > 0) {
          const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 220)
          mouseGlow.addColorStop(0, isLight ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.07)')
          mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = mouseGlow
          ctx.fillRect(0, 0, w, h)
        }
      }

      // 2. Update & Draw Particles
      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        p.pulsePhase += p.pulseSpeed

        // Soft wrap
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.08
        const finalAlpha = Math.min(0.45, Math.max(0.1, currentAlpha))
        const activeColor = isLight ? lightColors[p.colorIndex] : darkColors[p.colorIndex]

        // Proximity connections (Constellation effect)
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 110

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (isLight ? 0.12 : 0.15)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${activeColor}, ${lineAlpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // Particle circle
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
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
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
