import React, { forwardRef } from "react"
import { RigidBody } from "@react-three/rapier"

const Player = forwardRef(function Player({ position = [-4, 2, 14] }, ref) {

  return (
    <RigidBody
      ref={ref}
      type="dynamic"
      colliders="ball"
      friction={0.1}
      restitution={0}
      linearDamping={4}
      angularDamping={4}
      position={position}
    >
      <mesh>
        <sphereGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="red" transparent={true} opacity={0} />
      </mesh>
    </RigidBody>
  )
})

export default Player
