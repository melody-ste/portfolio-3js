import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"

export default function MouseDragLook() {
  const { camera, gl } = useThree()
  const dragging = useRef(false)
  const previous = useRef([0, 0])

  useEffect(() => {
    const element = gl.domElement

    function startDrag(x, y) {
      dragging.current = true
      previous.current = [x, y]
    }

    function endDrag() {
      dragging.current = false
    }

    function moveDrag(x, y) {
      if (!dragging.current) return
      const [prevX] = previous.current
      const dx = x - prevX
      previous.current = [x, y]

      const sensitivity = 0.002
      camera.rotation.y -= dx * sensitivity
    }

    // mouse
    function onMouseDown(e) { startDrag(e.clientX, e.clientY) }
    function onMouseUp() { endDrag() }
    function onMouseMove(e) { moveDrag(e.clientX, e.clientY) }

    element.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mousemove", onMouseMove)

    // touch
    function onTouchStart(e) {
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        startDrag(touch.clientX, touch.clientY)
      }
    }

    function onTouchEnd() { endDrag() }

    function onTouchMove(e) {
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        moveDrag(touch.clientX, touch.clientY)
      }
    }

    element.addEventListener("touchstart", onTouchStart)
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchmove", onTouchMove)

    // Cleanup
    return () => {
      element.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("mousemove", onMouseMove)

      element.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchmove", onTouchMove)
    }
  }, [camera, gl])

  return null
}
