import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useState } from "react"
import EnvScene from './Environment.jsx';

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


  return <>
    <EnvScene onPortalsReady={(p) => {
      console.log("PORTALS REÇUS :", p);
      setPortals(p);
    }}/>
  </>
}