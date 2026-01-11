import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Clouds as DreiClouds, Cloud } from "@react-three/drei"

export default function Grass() {
const group = useRef()

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.005
  })

  return (
    <group
      ref={group}
      position={[0, 10, -120]}
    >
      <ambientLight intensity={ 0.5 } />

      <DreiClouds
        material={THREE.MeshLambertMaterial}
        limit={400}
        range={300}
      >
        <Cloud
          frustumCulled={false}
          seed={1}
          bounds={[60, 25, 60]}
          volume={60}
          opacity={0.45}
          fade={40}
          growth={6}
          speed={0.01}
          color="#9481cf"
        />

        <Cloud
          frustumCulled={false}
          seed={2}
          position={[40, 15, 35]}
          bounds={[35, 8, 35]}
          volume={60}
          opacity={0.3}
          speed={0.05}
          color="#d497ec"
        />

        <Cloud
          frustumCulled={false}
          seed={2}
          position={[-90, -5, -95]}
          bounds={[55, 15, 55]}
          volume={65}
          opacity={0.3}
          speed={0.05}
          color="#ebb7ff"
        />

        <Cloud
          frustumCulled={false}
          seed={3}
          position={[80, 0, 50]}
          bounds={[55, 15, 65]}
          volume={55}
          opacity={0.30}
          speed={0.04}
          color="#bfaaff"
        />

      </DreiClouds>
    </group>
  )
}