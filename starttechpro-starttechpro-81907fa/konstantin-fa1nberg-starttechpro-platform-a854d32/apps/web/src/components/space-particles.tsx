"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

export function SpaceParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let isMobile = false
    if (typeof window !== "undefined") {
      isMobile = window.innerWidth < 768
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      isMobile = window.innerWidth < 768
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    // Создаём частицы
    const particleCount = isMobile ? 50 : 150
    const colors = ["#40E0D0", "#BA55D3", "#1E90FF"]
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    particlesRef.current = particles

    const render = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const time = Date.now() * 0.001

      // Обновляем и рисуем частицы
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Движение
        p.x += p.speedX
        p.y += p.speedY

        // Мерцание
        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7

        // Отталкивание от курсора
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.5
          p.x -= (dx / dist) * force
          p.y -= (dy / dist) * force
        }

        // Границы
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Рисуем частицу
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity * twinkle
        ctx.fill()

        // Неоновое свечение
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = 1

      // Соединительные линии
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.4
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.strokeStyle = `rgba(186, 85, 211, ${opacity})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  )
}