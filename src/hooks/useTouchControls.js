import { useRef, useState } from "react"

export function useTouchControls(radius = 40) {
  const [pos, setPos] = useState({ x: 0, y: 0, active: false })
  const center = useRef({ x: 0, y: 0 })

  const onTouchStart = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    center.current.x = rect.left + rect.width / 2
    center.current.y = rect.top + rect.height / 2

    setPos(p => ({ ...p, active: true }))
  }

  const onTouchMove = (e) => {
    const touch = e.touches[0]

    let dx = touch.clientX - center.current.x
    let dy = touch.clientY - center.current.y

    const dist = Math.hypot(dx, dy)
    if (dist > radius) {
      const angle = Math.atan2(dy, dx)
      dx = Math.cos(angle) * radius
      dy = Math.sin(angle) * radius
    }

    setPos({ x: dx, y: dy, active: true })
  }

  const onTouchEnd = () => {
    setPos({ x: 0, y: 0, active: false })
  }

  return {
    state: pos,
    bind: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
    direction: {
      x: pos.x / radius,
      y: pos.y / radius
    }
  }
}
