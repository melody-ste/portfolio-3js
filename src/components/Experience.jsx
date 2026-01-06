import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls, Html} from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import { Physics } from '@react-three/rapier'
import RAPIER from '@dimforge/rapier3d-compat'

import EnvScene from './Environment.jsx';
import Player from "./Player"

export default function Experience({ headerVisible, setHeaderVisible, showCard, setShowCard, showCardProjects, setShowCardProjects, onPlayerReady, touchControls})
{
  const { camera } = useThree()
  const playerRef = useRef()
  const speed = 4
  const impulseStrength = 1;

  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const leftward = useKeyboardControls((state) => state.leftward)
  const rightward = useKeyboardControls((state) => state.rightward)

  // portals data coming from EnvScene
  const [portals, setPortals] = useState(null);

  const [showPortalButton, setShowPortalButton] = useState(false);
  const [showPortal4Button, setShowPortal4Button] = useState(false);

  // TELEPORT SYSTEM
  const cooldown = useRef(0);
  const raycaster = useRef(new THREE.Raycaster()).current;
  const cameraDir = useRef(new THREE.Vector3()).current;

  useFrame((state, delta) => {
    if (!playerRef.current) return

    const impulse = { x: 0, y: 0, z: 0 }
    
    // keyboard
    if (forward) impulse.z -= impulseStrength
    if (backward) impulse.z += impulseStrength
    if (leftward) impulse.x -= impulseStrength
    if (rightward) impulse.x += impulseStrength

    // tactile
    if (touchControls) {
      const { x, y } = touchControls.direction.current
      impulse.x += x
      impulse.z += -y
    }

    const moving = impulse.x !== 0 || impulse.z !== 0;
    if (moving && headerVisible) setHeaderVisible(false)

    const camDir = new THREE.Vector3()
    camera.getWorldDirection(camDir)
    camDir.y = 0
    camDir.normalize()

    const side = new THREE.Vector3()
    side.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize()

    const move = new THREE.Vector3()
    move.addScaledVector(camDir, -impulse.z* speed)
    move.addScaledVector(side, impulse.x* speed)

    const currentLinvel = playerRef.current.linvel()
    playerRef.current.setLinvel({ x: move.x, y: currentLinvel.y, z: move.z })

    const p = playerRef.current.translation()
    camera.position.lerp(new THREE.Vector3(p.x, p.y, p.z), 0.3)

    if (!portals) return

    // PORTALS 
    const detectRadius = 20
    // portal_03
    if (portals.portal_03) {
      const portalPos = new THREE.Vector3()
      portals.portal_03.getWorldPosition(portalPos)
      setShowPortalButton(camera.position.distanceTo(portalPos) < detectRadius)
    }
    // portal_04
    if (portals.portal_04) {
      const portalPos = new THREE.Vector3()
      portals.portal_04.getWorldPosition(portalPos)
      setShowPortal4Button(camera.position.distanceTo(portalPos) < detectRadius)
    }

    // --- teleportation ---
    cooldown.current -= delta;
    if (cooldown.current > 0) return;

    camera.getWorldDirection(cameraDir);
    cameraDir.normalize();

    const rayOrigin = camera.position.clone().add(new THREE.Vector3(0, 0.5, 0));
    raycaster.set(rayOrigin, cameraDir);

    const radius = 2;

    for (const name in portals) {
      const portal = portals[name];

      const hit = raycaster.intersectObject(portal, true)[0];
      const distance = hit?.distance;

      if (distance !== undefined && distance < radius) {

        const link = {
          portal_01: "portal_03",
          portal_02: "portal_04",
          portal_03: "portal_01",
          portal_04: "portal_02",
        };

        const targetName = link[name];
        const targetPortal = portals[targetName];

        // --- Exit position ---
        const targetPos = new THREE.Vector3();
        targetPortal.getWorldPosition(targetPos);

        const exitDir = new THREE.Vector3(0, 0, -1);
        exitDir.applyQuaternion(targetPortal.quaternion);
        exitDir.y = 0;
        exitDir.normalize();

        targetPos.addScaledVector(exitDir, -8);
        targetPos.y += 2;

        playerRef.current.setTranslation({
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z
        }, true)

        const currentLinvel = playerRef.current.linvel()
        playerRef.current.setLinvel({ x: 0, y: currentLinvel.y, z: 0 })

        const lookDir = exitDir.clone().multiplyScalar(-1)
        const extraRotation = THREE.MathUtils.degToRad(20)
        const yaw = Math.atan2(lookDir.x, lookDir.z) + Math.PI + extraRotation
        camera.rotation.set(0, yaw, 0)

        cooldown.current = 1.2;
      }
    }
  });
  
  // BUTTON POSITION portal_03
  let buttonPosition = new THREE.Vector3(0, 0, 0)
  if (showPortalButton && portals?.portal_03) {
    const pos = new THREE.Vector3()
    portals.portal_03.getWorldPosition(pos)

    const offset = new THREE.Vector3(3, 2, 17)
    offset.applyQuaternion(portals.portal_03.quaternion)
    pos.add(offset)

    buttonPosition = pos
  }

  // BUTTON POSITION portal_04
  let buttonPositionPortal4 = new THREE.Vector3(0, 0, 0)
  if (showPortal4Button && portals?.portal_04) {
    const pos = new THREE.Vector3()
    portals.portal_04.getWorldPosition(pos)

    const offset = new THREE.Vector3(2, 2, 16)
    offset.applyQuaternion(portals.portal_04.quaternion)
    pos.add(offset)

    buttonPositionPortal4 = pos
  }

  const resetCameraRotation = () => {
    camera.rotation.set(0, 0, 0)
  }

  useEffect(() => {
    if (!playerRef.current || !portals) return

    const goToStart = () => {
      playerRef.current.setTranslation({ x: -4, y: 2, z: 14 }, true)
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 })
      playerRef.current.setAngvel({ x: 0, y: 0, z: 0 })

      resetCameraRotation()
    }

    const goToPortal = (name) => {
      const portal = portals[name]
      if (!portal) return

      const pos = new THREE.Vector3()
      portal.getWorldPosition(pos)

      const exitDir = new THREE.Vector3(0, 0, -1)
      exitDir.applyQuaternion(portal.quaternion)
      exitDir.y = 0
      exitDir.normalize()

      pos.addScaledVector(exitDir, -8)
      pos.y += 2

      playerRef.current.setTranslation(
        { x: pos.x, y: pos.y, z: pos.z },
        true
      )
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 })
      playerRef.current.setAngvel({ x: 0, y: 0, z: 0 })

      const lookDir = exitDir.clone().multiplyScalar(-1)

      const extraRotation = THREE.MathUtils.degToRad(20)
      const yaw =
        Math.atan2(lookDir.x, lookDir.z) +
        Math.PI +
        extraRotation

      camera.rotation.set(0, yaw, 0)
    }

    onPlayerReady?.({
      goToStart,
      goToPortal03: () => goToPortal("portal_03"),
      goToPortal04: () => goToPortal("portal_04"),
    })
  }, [portals, onPlayerReady])


  return <>
    <Physics gravity={[0, -9.81, 0]} rapier={RAPIER}>
      <EnvScene onPortalsReady={setPortals}/>
      <Player ref={playerRef} />
    </Physics>

    {showPortalButton && !showCard && portals?.portal_03 && (
      <Html
        position={buttonPosition}
        center
        distanceFactor={8}
      >
        <button onClick={() => setShowCard(true)} className="open-button" >
          Open resume
        </button>
      </Html>
    )}

    {showPortal4Button && !showCardProjects && portals?.portal_04 && (
      <Html
        position={buttonPositionPortal4}
        center
        distanceFactor={8}
      >
        <button 
          onClick={() => setShowCardProjects(true)} 
          className="open-button"
        >
          Open projects
        </button>
      </Html>
    )}
  
  </>
}