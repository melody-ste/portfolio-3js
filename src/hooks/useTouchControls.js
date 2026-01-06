import { useRef } from "react"

export function useTouchControls(radius = 55) {
  const state = useRef({
    x: 0,
    y: 0,
    active: false,
    startX: 0,
    startY: 0
  })

  const onTouchStart = (e) => {
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()

    state.current.centerX = rect.left + rect.width / 2
    state.current.centerY = rect.top + rect.height / 2
    state.current.active = true
  }

  const onTouchMove = (e) => {
    if (!state.current.active) return

    const touch = e.touches[0]
    let dx = touch.clientX - state.current.centerX
    let dy = touch.clientY - state.current.centerY

    const dist = Math.hypot(dx, dy)
    if (dist > radius) {
      const angle = Math.atan2(dy, dx)
      dx = Math.cos(angle) * radius
      dy = Math.sin(angle) * radius
    }

    state.current.x = dx
    state.current.y = dy
  }

  const onTouchEnd = () => {
    state.current.active = false
    state.current.x = 0
    state.current.y = 0
  }

  return {
    state,
    bind: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
    get direction() {
      return {
        x: state.current.x / radius,
        y: state.current.y / radius
      }
    }
  }
}
