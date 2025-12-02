import * as THREE from 'three'
import { useEffect } from "react";
import { Environment, useGLTF } from '@react-three/drei';
import { useControls } from "leva";

import Grass from "./Grass";

//  -- TEXTURE --
const textureLoader = new THREE.TextureLoader();
const enviroBaseColorTexture = textureLoader.load('/textures/enviro_BaseColor.png');
enviroBaseColorTexture.flipY = false
enviroBaseColorTexture.colorSpace = THREE.SRGBColorSpace
const islandsBaseColorTexture = textureLoader.load('/textures/islands_BaseColor.png');
islandsBaseColorTexture.flipY = false
islandsBaseColorTexture.colorSpace = THREE.SRGBColorSpace
const enviroMaterial = new THREE.MeshStandardMaterial({ map: enviroBaseColorTexture })
const islandsMaterial = new THREE.MeshStandardMaterial({ map: islandsBaseColorTexture })

export default function EnvScene()
{
  const environment = useGLTF('/enviro.glb');
  const islands = useGLTF('/islands.glb');
  const vines = useGLTF('/vines.glb');

  // -- Leva panel -- 
  const { roughness } = useControls("Material", {
    roughness: { value: 1, min: 0, max: 1, step: 0.01 },
  });

  useEffect(() => {
    enviroMaterial.roughness = roughness;
  }, [roughness]);

  useEffect(() => {
    if (!environment?.scene) return;

    environment.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = enviroMaterial;
      }
    });
  }, [environment]);

  useEffect(() => {
    if (!islands?.scene) return;

    islands.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = islandsMaterial;
        child.material.needsUpdate = true;
      }
    });
  }, [islands]);

  
  // console.log(islandsBaseColorTexture);
  // console.log(environment.scene);
  // console.log("CHILDREN:", environment.scene.children);

  return <>
    <Environment preset="sunset"></Environment>

    <primitive object={ environment.scene }  scale={60}/>
    <primitive object={ islands.scene }  scale={60} />
    <primitive object={ vines.scene }  scale={60} />
    {/* <Grass /> */}
  </>
}