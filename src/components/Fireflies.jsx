import * as THREE from 'three'
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

import firefliesVertex from "../shaders/fireflies/vertex.glsl?raw";
import firefliesFragment from "../shaders/fireflies/fragment.glsl?raw";

export default function Fireflies({ count = 150, radius = 120 }) {

  const { positions, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Random inside a big sphere
      const r = radius
      positions[i3 + 0] = (Math.random() - 0.5) * r
      positions[i3 + 1] = (Math.random() * r * 0.6) 
      positions[i3 + 2] = (Math.random() - 0.5) * r

      scales[i] = Math.random() * 1 + 0.5
    }

    return { positions, scales }
  }, [count, radius])

  const fireflyMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 200 },
        uTime: { value: 0 }
      },
      vertexShader: {firefliesVertex},
      fragmentShader: {firefliesFragment}
    })
  }, [])

  useFrame((state) => {
    fireflyMaterial.uniforms.uTime.value = state.clock.elapsedTime
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geom.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
    return geom
  }, [])

  return (
    <points geometry={geometry} material={fireflyMaterial} />
  )
}
