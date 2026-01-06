import { useRef } from "react"

export function useTouchControls() {
  const direction = useRef({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  })

  const onTouchStart = (e) => {
    const touch = e.touches[0]
    direction.current.startX = touch.clientX
    direction.current.startY = touch.clientY
  }

  const onTouchMove = (e) => {
    const touch = e.touches[0]
    const dx = touch.clientX - direction.current.startX
    const dy = touch.clientY - direction.current.startY

    const max = 50
    direction.current.x = Math.max(-1, Math.min(1, dx / max))
    direction.current.y = Math.max(-1, Math.min(1, dy / max))
  }

  const onTouchEnd = () => {
    direction.current.x = 0
    direction.current.y = 0
  }

  return {
    direction,
    bind: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  }
}
