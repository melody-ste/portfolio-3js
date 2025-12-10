import { RigidBody } from "@react-three/rapier"
import { useRef } from "react"

export default function Player() {
  const bodyRef = useRef()

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      colliders="capsule"
      friction={0}
      restitution={0}
      enabledRotations={[false, false, false]}
    >
      <mesh visible={false}>
        <capsuleGeometry args={[0.3, 1]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>
    </RigidBody>
  )
}
