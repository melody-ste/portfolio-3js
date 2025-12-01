import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useState } from "react"
import Environment from './Environment.jsx';

export default function Experience({ headerVisible, setHeaderVisible })
{
  const camera = useThree((state) => state.camera)
  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const leftward = useKeyboardControls((state) => state.leftward)
  const rightward = useKeyboardControls((state) => state.rightward)

  const speed = 2

  useFrame((state, delta) => {

    const direction = new THREE.Vector3()

    // forward / backward
    if (forward) direction.z -= 1
    if (backward) direction.z += 1

    // left / right
    if (leftward) direction.x -= 1
    if (rightward) direction.x += 1

    const moving = direction.length() > 0

    if (moving && headerVisible) {
      setHeaderVisible(false)
    }

    if (moving) {
      setHeaderVisible(false)
      direction.normalize()
      direction.applyEuler(camera.rotation)
      direction.multiplyScalar(speed * delta)
      camera.position.add(direction)
    }
  })

  return <>
    <Environment />
  </>
}