import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls, Html} from "@react-three/drei"
import { useRef, useState } from "react"
import { Physics } from '@react-three/rapier'

import EnvScene from './Environment.jsx';
import Player from "./Player"

export default function Experience({ headerVisible, setHeaderVisible, showCard, setShowCard, showCardProjects, setShowCardProjects })
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
    if (forward) impulse.z -= impulseStrength
    if (backward) impulse.z += impulseStrength
    if (leftward) impulse.x -= impulseStrength
    if (rightward) impulse.x += impulseStrength

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

    const radius = 3;

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

        const exitDir = new THREE.Vector3(0, 1, 0)
          .applyQuaternion(targetPortal.quaternion)
          .normalize();

        targetPos.add(exitDir.multiplyScalar(1.5))
        targetPos.y += 2;

        playerRef.current.setTranslation({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, true)

        camera.lookAt(targetPos.clone().add(exitDir))
        cooldown.current = 0.6;
      }
    }
  });

  // BUTTON POSITION portal_03
  let buttonPosition = new THREE.Vector3(0, 0, 0)
  if (showPortalButton && portals?.portal_03) {
    const pos = new THREE.Vector3()
    portals.portal_03.getWorldPosition(pos)

    const offset = new THREE.Vector3(-5, -12, 5 )
    offset.applyQuaternion(portals.portal_03.quaternion)
    pos.add(offset)

    buttonPosition = pos
  }

  // BUTTON POSITION portal_04
  let buttonPositionPortal4 = new THREE.Vector3(0, 0, 0)
  if (showPortal4Button && portals?.portal_04) {
    const pos = new THREE.Vector3()
    portals.portal_04.getWorldPosition(pos)

    const offset = new THREE.Vector3(-5, -12, 5)
    offset.applyQuaternion(portals.portal_04.quaternion)
    pos.add(offset)

    buttonPositionPortal4 = pos
  }

  return <>
    <Physics debug>
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