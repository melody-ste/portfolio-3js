import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls, Html} from "@react-three/drei"
import { useRef, useState } from "react"

import EnvScene from './Environment.jsx';
import Resume from "./Resume";

export default function Experience({ headerVisible, setHeaderVisible })
{
  const camera = useThree((state) => state.camera)
  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const leftward = useKeyboardControls((state) => state.leftward)
  const rightward = useKeyboardControls((state) => state.rightward)

  const speed = 2

  // portals data coming from EnvScene
  const [portals, setPortals] = useState(null);

  const [showPortalButton, setShowPortalButton] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // TELEPORT SYSTEM
  const cooldown = useRef(0);
  const raycaster = useRef(new THREE.Raycaster()).current;
  const cameraDir = useRef(new THREE.Vector3()).current;

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

    if (!portals) return;

    // --- detect portal 03 proximity ---
    const portal03 = portals.portal_03;
    if (portal03) {
      const portalPos = new THREE.Vector3();
      portal03.getWorldPosition(portalPos);

      const showRadius = 20;
      setShowPortalButton(camera.position.distanceTo(portalPos) < showRadius);
    }

    // --- teleportation ---
    cooldown.current -= delta;
    if (cooldown.current > 0) return;

    camera.getWorldDirection(cameraDir);
    cameraDir.normalize();

    const rayOrigin = camera.position.clone().add(new THREE.Vector3(0, 0.5, 0));
    raycaster.set(rayOrigin, cameraDir);

    const radius = 1.2;

    for (const name in portals) {
      const portal = portals[name];

      const hit = raycaster.intersectObject(portal, true)[0];
      const distance = hit?.distance;

      if (distance !== undefined && distance < radius) {
        console.log("Entré dans", name);

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

        const exitDir = new THREE.Vector3(0, -1, 0)
          .applyQuaternion(targetPortal.quaternion)
          .normalize();

        targetPos.add(exitDir);

        targetPos.y += 2;
        camera.position.copy(targetPos);

        const lookAtTarget = targetPos.clone().add(exitDir);
        camera.lookAt(lookAtTarget);
        cooldown.current = 0.6;
      }
    }
  });

  let buttonPosition = new THREE.Vector3(0, 0, 0)
  if (showPortalButton && portals?.portal_03) {
    const pos = new THREE.Vector3()
    portals.portal_03.getWorldPosition(pos)

    const offset = new THREE.Vector3(-5, -12, 5 )
    offset.applyQuaternion(portals.portal_03.quaternion)
    pos.add(offset)

    buttonPosition = pos
  }

  return <>
    <EnvScene onPortalsReady={(p) => {
      console.log("PORTALS REÇUS :", p);
      setPortals(p);
    }}/>

    {showPortalButton && !showCard && portals?.portal_03 && (
      <Html
        position={buttonPosition}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'auto', zIndex: 10 }}
      >
        <button onClick={() => setShowCard(true)} >
          Ouvrir le résumé
        </button>
      </Html>
    )}

    {showCard && (
      <Html fullscreen style={{ pointerEvents: 'auto', zIndex: 100 }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            background: '#fff',
            padding: '40px',
            borderRadius: '10px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90%',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowCard(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontSize: 20,
              }}
            >✕</button>
            <Resume />
          </div>
        </div>
      </Html>
    )}
  
  </>
}