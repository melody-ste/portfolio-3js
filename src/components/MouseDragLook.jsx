import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"

export default function MouseDragLook() {
  const { camera, gl } = useThree()
  const dragging = useRef(false)
  const previous = useRef([0, 0])

  useEffect(() => {
    const element = gl.domElement

    const onMouseDown = (e) => {
      dragging.current = true
      previous.current = [e.clientX, e.clientY]
    }

    const onMouseUp = () => {
      dragging.current = false
    }

    const onMouseMove = (e) => {
      if (!dragging.current) return

      const [prevX] = previous.current
      const dx = e.clientX - prevX
      previous.current = [e.clientX, e.clientY]

      const sensitivity = 0.002

      // 🔥 rotation horizontale uniquement
      camera.rotation.y -= dx * sensitivity
    }

    element.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mousemove", onMouseMove)

    return () => {
      element.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [camera, gl])

  return null
}
