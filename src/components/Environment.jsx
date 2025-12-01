import * as THREE from 'three'
import { useEffect } from "react";
import { Environment, useGLTF } from '@react-three/drei';
import { useControls } from "leva";

import Grass from "./Grass";

const textureLoader = new THREE.TextureLoader();
const baseColorTexture = textureLoader.load('/textures/enviro_BaseColor.png');
baseColorTexture.flipY = false
baseColorTexture.colorSpace = THREE.SRGBColorSpace
const enviroMaterial = new THREE.MeshStandardMaterial({ map: baseColorTexture })

export default function EnvScene()
{
  const environment = useGLTF('/enviro.glb');

  // Leva panel
  const rocks1Ctrl = useControls("Rocks 1", {
    posX: { value: 20, min: -40, max: 40, step: 0.1 },
    posZ: { value: -3, min: -20, max: 20, step: 0.1 },
    rotY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    scale: { value: 1.2, min: 0.1, max: 5, step: 0.1 },
  });

  const rocks2Ctrl = useControls("Rocks 2", {
    posX: { value: -18.5, min: -40, max: 40, step: 0.1 },
    posZ: { value: -10, min: -40, max: 40, step: 0.1 },
    rotY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    scale: { value: 1.2, min: 0.1, max: 5, step: 0.1 },
  });

  const rocks3Ctrl = useControls("Rocks 3", {
    posX: { value: 7, min: -40, max: 40, step: 0.1 },
    posZ: { value: 0, min: -40, max: 40, step: 0.1 },
    rotY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    scale: { value: 1.2, min: 0.1, max: 5, step: 0.1 },
  });

  const signCtrl = useControls("Sign", {
    posX: { value: 6, min: -40, max: 40, step: 0.1 },
    posZ: { value: -18, min: -40, max: 40, step: 0.1 },
    rotY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 5, step: 0.1 },
  });

  const mush1Ctrl = useControls("Mushrooms 1", {
    posX: { value: 20, min: -40, max: 40, step: 0.1 },
    posZ: { value: -3, min: -40, max: 40, step: 0.1 },
    rotY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 5, step: 0.1 },
  });

  const mush2Ctrl = useControls("Mushrooms 2", {
    posX: { value: 7, min: -40, max: 40, step: 0.1 },
    posZ: { value: 0, min: -40, max: 40, step: 0.1 },
    rotY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 5, step: 0.1 },
  });

  const mush3Ctrl = useControls("Mushrooms 3", {
    posX: { value: -18.5, min: -40, max: 40, step: 0.1 },
    posZ: { value: -10, min: -40, max: 40, step: 0.1 },
    rotY: { value: 0, min: 0, max: 0, step: 0.01 },
    scale: { value: 1, min: 0.1, max: 5, step: 0.1 },
  });

  const { roughness } = useControls("Material", {
    roughness: { value: 1, min: 0, max: 1, step: 0.01 },
  });

  useEffect(() => {
    enviroMaterial.roughness = roughness;
  }, [roughness]);

  useEffect(() => {
    if (!environment?.scene) return;

    const rocks1 = environment.scene.getObjectByName("grp_rocks_01");
    const rocks2 = environment.scene.getObjectByName("grp_rocks_02");
    const rocks3 = environment.scene.getObjectByName("grp_rocks_03");
    const sign = environment.scene.getObjectByName("grp_pancarte");
    const mush1 = environment.scene.getObjectByName("grp_mushrooms_01");
    const mush2 = environment.scene.getObjectByName("grp_mushrooms_02");
    const mush3 = environment.scene.getObjectByName("grp_mushrooms_03");

   if (rocks1) {
      rocks1.position.set(rocks1Ctrl.posX, 0, rocks1Ctrl.posZ);
      rocks1.rotation.set(Math.PI / 2, rocks1Ctrl.rotY, 0);
      rocks1.scale.set(rocks1Ctrl.scale, rocks1Ctrl.scale, rocks1Ctrl.scale);
    }
    if (rocks2) {
      rocks2.position.set(rocks2Ctrl.posX, 0, rocks2Ctrl.posZ);
      rocks2.rotation.set(Math.PI / 2, rocks2Ctrl.rotY, 0);
      rocks2.scale.set(rocks2Ctrl.scale, rocks2Ctrl.scale, rocks2Ctrl.scale);
    }
    if (rocks3) {
      rocks3.position.set(rocks3Ctrl.posX, 0, rocks3Ctrl.posZ);
      rocks3.rotation.set(Math.PI / 2, rocks3Ctrl.rotY, 0);
      rocks3.scale.set(rocks3Ctrl.scale, rocks3Ctrl.scale, rocks3Ctrl.scale);
    }
    if (sign) {
      sign.position.set(signCtrl.posX, 0, signCtrl.posZ);
      sign.rotation.set(Math.PI / 2, signCtrl.rotY, 0);
      sign.scale.set(signCtrl.scale, signCtrl.scale, signCtrl.scale);
    }
    if (mush1) {
      mush1.position.set(mush1Ctrl.posX, 0, mush1Ctrl.posZ);
      mush1.rotation.set(Math.PI / 2, mush1Ctrl.rotY, 0);
      mush1.scale.set(mush1Ctrl.scale, mush1Ctrl.scale, mush1Ctrl.scale);
    }
    if (mush2) {
      mush2.position.set(mush2Ctrl.posX, 0, mush2Ctrl.posZ);
      mush2.rotation.set(Math.PI / 2, mush2Ctrl.rotY, 0);
      mush2.scale.set(mush2Ctrl.scale, mush2Ctrl.scale, mush2Ctrl.scale);
    }
    if (mush3) {
      mush3.position.set(mush3Ctrl.posX, 0, mush3Ctrl.posZ);
      mush3.rotation.set(Math.PI / 2, mush3Ctrl.rotY, 0);
      mush3.scale.set(mush3Ctrl.scale, mush3Ctrl.scale, mush3Ctrl.scale);
    }
  }, [
    environment,
    rocks1Ctrl,
    rocks2Ctrl,
    rocks3Ctrl,
    signCtrl,
    mush1Ctrl,
    mush2Ctrl,
    mush3Ctrl,
  ]);

  useEffect(() => {
    if (!environment?.scene) return;

    environment.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = enviroMaterial;
      }
    });
  }, [environment]);

  // console.log(environment.scene);
  // console.log("CHILDREN:", environment.scene.children);

  return <>
    <Environment preset="sunset"></Environment>

    <primitive object={ environment.scene } />
    <Grass />
  </>
}