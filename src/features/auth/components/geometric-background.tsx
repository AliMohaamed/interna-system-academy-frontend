"use client"

import { useEffect, useRef } from "react"

export function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#0F172A")
    gradient.addColorStop(1, "#003366")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw geometric shapes
    const shapes: { x: number; y: number; size: number; rotation: number; type: string; opacity: number }[] = []

    for (let i = 0; i < 30; i++) {
      shapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 60 + 20,
        rotation: Math.random() * Math.PI * 2,
        type: ["hexagon", "triangle", "square", "circle"][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.08 + 0.02,
      })
    }

    const drawHexagon = (x: number, y: number, size: number, rotation: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation
        const px = x + size * Math.cos(angle)
        const py = y + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    const drawTriangle = (x: number, y: number, size: number, rotation: number) => {
      ctx.beginPath()
      for (let i = 0; i < 3; i++) {
        const angle = ((Math.PI * 2) / 3) * i + rotation - Math.PI / 2
        const px = x + size * Math.cos(angle)
        const py = y + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    shapes.forEach((shape) => {
      ctx.save()
      ctx.globalAlpha = shape.opacity

      if (shape.type === "hexagon") {
        drawHexagon(shape.x, shape.y, shape.size, shape.rotation)
        ctx.strokeStyle = "#2DD4BF"
        ctx.lineWidth = 1.5
        ctx.stroke()
      } else if (shape.type === "triangle") {
        drawTriangle(shape.x, shape.y, shape.size, shape.rotation)
        ctx.strokeStyle = "#2DD4BF"
        ctx.lineWidth = 1.5
        ctx.stroke()
      } else if (shape.type === "square") {
        ctx.translate(shape.x, shape.y)
        ctx.rotate(shape.rotation)
        ctx.strokeStyle = "#0F766E"
        ctx.lineWidth = 1.5
        ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
      } else {
        ctx.beginPath()
        ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2)
        ctx.strokeStyle = "#0F766E"
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      ctx.restore()
    })

    // Draw code snippets effect
    ctx.font = "12px monospace"
    ctx.fillStyle = "rgba(45, 212, 191, 0.15)"
    const codeSnippets = [
      "const learn = () => grow();",
      "function code() { return success; }",
      "class Student extends Developer {}",
      "<Code passion={true} />",
      "await master(skills);",
      "export { future };",
    ]

    for (let i = 0; i < 8; i++) {
      const x = Math.random() * width * 0.8
      const y = Math.random() * height
      ctx.fillText(codeSnippets[i % codeSnippets.length], x, y)
    }

    // Draw grid pattern
    ctx.strokeStyle = "rgba(45, 212, 191, 0.03)"
    ctx.lineWidth = 1
    const gridSize = 40

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
