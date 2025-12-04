import * as THREE from 'three'
import { useEffect } from "react";
import { Environment, useGLTF } from '@react-three/drei';
import { useControls } from "leva";

import Grass from "./Grass";
import portalsVertex from "../shaders/portals/vertex.glsl?raw";
import portalsFragment from "../shaders/portals/fragment.glsl?raw";

//  -- TEXTURE --
const textureLoader = new THREE.TextureLoader();
const enviroBaseColorTexture = textureLoader.load('/textures/enviro_BaseColor.png');
enviroBaseColorTexture.flipY = false
enviroBaseColorTexture.colorSpace = THREE.SRGBColorSpace

const islandsBaseColorTexture = textureLoader.load('/textures/islands_BaseColor.png');
islandsBaseColorTexture.flipY = false
const islandsNormalTexture = textureLoader.load('/textures/islands_Normal.png');
islandsNormalTexture.flipY = false;
islandsBaseColorTexture.colorSpace = THREE.SRGBColorSpace

const vinesBaseColorTexture = textureLoader.load('/textures/vines_BaseColor.png');
vinesBaseColorTexture.flipY = false
const vinesNormalTexture = textureLoader.load('/textures/vines_Normal.png');
vinesNormalTexture.flipY = false;
vinesBaseColorTexture.colorSpace = THREE.SRGBColorSpace

const enviroMaterial = new THREE.MeshStandardMaterial({ map: enviroBaseColorTexture })
const islandsMaterial = new THREE.MeshStandardMaterial({
  map: islandsBaseColorTexture,
  normalMap: islandsNormalTexture,
  normalScale: new THREE.Vector2(0.4, 0.4)
});

const vinesMaterial = new THREE.MeshStandardMaterial({
  map: vinesBaseColorTexture,
  normalMap: vinesNormalTexture,
  normalScale: new THREE.Vector2(0.4, 0.4)
});

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
      if (!child.isMesh) return;

      const mesh = child;

      if (!mesh.geometry) return;
      if (!mesh.geometry.attributes.position) return;

      // check UV obligatoire si tu utilises map / normalMap
      if (!mesh.geometry.attributes.uv) {
        console.warn("Mesh sans UV ignoré :", mesh.name);
        return;
      }

      mesh.material = enviroMaterial;
      mesh.material.needsUpdate = true;
    });
  }, [environment]);

  useEffect(() => {
    if (!islands?.scene) return;

    islands.scene.traverse(child => {
      if (child.isMesh) {
        child.material.dispose();
        child.material = islandsMaterial.clone();
        child.material.needsUpdate = true;
      }
    });
  }, [islands]);

  useEffect(() => {
    if (!vines?.scene) return;

    vines.scene.traverse(child => {
      if (child.isMesh) {
        child.material.dispose();
        child.material = vinesMaterial.clone();
        child.material.needsUpdate = true;
      }
    });
  }, [vines]);

  
  // console.log(islandsBaseColorTexture);
  // console.log(environment.scene);
  // console.log("CHILDREN:", environment.scene.children);

  return <>
    <Environment preset="sunset"></Environment>

    <primitive object={ environment.scene }  scale={60}/>
    <primitive object={ islands.scene }  scale={60} />
    <primitive object={ vines.scene }  scale={60} />
    <Grass/>
  </>
}