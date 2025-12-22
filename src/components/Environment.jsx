import * as THREE from 'three'
import { useEffect, useMemo} from "react";
import { Environment, useGLTF } from '@react-three/drei';
import { useControls } from "leva";
import { useFrame} from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier"

import Grass from "./Grass";
import Fireflies from "./Fireflies";
import portalsVertex from "../shaders/portals/vertex.glsl?raw";
import portalsFragment from "../shaders/portals/fragment.glsl?raw";
import perlinNoise from '../shaders/includes/perlinNoise3d.glsl?raw';

//  -- TEXTURE --
const textureLoader = new THREE.TextureLoader();
const enviroBaseColorTexture = textureLoader.load('/textures/enviro_BaseColor.png');
enviroBaseColorTexture.flipY = false
enviroBaseColorTexture.colorSpace = THREE.SRGBColorSpace
const enviroEmissiveTexture = textureLoader.load('/textures/enviro_Emissive.png');
enviroEmissiveTexture.flipY = false;
enviroEmissiveTexture.colorSpace = THREE.SRGBColorSpace;

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

const enviroMaterial = new THREE.MeshStandardMaterial({ 
  map: enviroBaseColorTexture,
  emissiveMap: enviroEmissiveTexture,
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 1.0
})

const islandsMaterial = new THREE.MeshStandardMaterial({
  map: islandsBaseColorTexture,
  normalMap: islandsNormalTexture,
  normalScale: new THREE.Vector2(0.6, 0.6)
});

const vinesMaterial = new THREE.MeshStandardMaterial({
  map: vinesBaseColorTexture,
  normalMap: vinesNormalTexture,
  normalScale: new THREE.Vector2(0.4, 0.4)
});

export default function EnvScene({ onPortalsReady })
{
  const environment = useGLTF('/enviro.glb');
  const islands = useGLTF('/islands.glb');
  const vines = useGLTF('/vines.glb');
  const fragmentShader = `
    ${perlinNoise}
    ${portalsFragment}
    `;

  const portals = useGLTF('/portals.glb');
  const portalsRef = useMemo(() => ({}), []);

  const roughness = 1;
  const colorStart = "#0b0722";
  const colorEnd = "#de87f1";
  
  useEffect(() => {
    enviroMaterial.roughness = roughness;
  }, [roughness]);

  useEffect(() => {
    if (!environment?.scene) return;

    environment.scene.traverse((child) => {
      if (!child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }

      const mesh = child;

      if (!mesh.geometry) return;
      if (!mesh.geometry.attributes.position) return;

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

    vines.scene.traverse(mesh => {
      if (mesh.isMesh) {
        mesh.material?.dispose();
        mesh.material = vinesMaterial.clone();
        mesh.material.needsUpdate = true;
      }
    });
  }, [vines]);

  useEffect(() => {
    if (!portals?.scene) return;

    portals.scene.traverse(mesh => {
      if (mesh.isMesh) {
        mesh.material = new THREE.ShaderMaterial({

          vertexShader: portalsVertex,
          fragmentShader: fragmentShader,
          uniforms: { 
            uTime: { value: 0 }, 
            uColorStart: { value: new THREE.Color(colorStart) }, 
            uColorEnd: { value: new THREE.Color(colorEnd) } 
          },
          transparent: true,
          side: THREE.DoubleSide,
        });
        portalsRef[mesh.name] = mesh;

        // calcul aEdgeDist
        let geom = mesh.geometry;

        let nonIndexed = geom.index ? geom.toNonIndexed() : geom;
        const posAttr = nonIndexed.attributes.position;
        const count = posAttr.count;

        let cx = 0, cy = 0;
        for (let i = 0; i < count; i++) {
          cx += posAttr.getX(i);
          cy += posAttr.getY(i);
        }
        cx /= count;
        cy /= count;

        let maxR = 0;
        for (let i = 0; i < count; i++) {
          const dx = posAttr.getX(i) - cx;
          const dy = posAttr.getY(i) - cy;
          const r = Math.hypot(dx, dy);
          if (r > maxR) maxR = r;
        }
        if (maxR === 0) maxR = 1e-6;

        const edge = new Float32Array(count);
        for (let i = 0; i < count; i++) {
          const dx = posAttr.getX(i) - cx;
          const dy = posAttr.getY(i) - cy;
          const r = Math.hypot(dx, dy);
          let v = 1.0 - (r / maxR);
          edge[i] = Math.max(0, Math.min(1, v));
        }

        nonIndexed.setAttribute("aEdgeDist", new THREE.BufferAttribute(edge, 1));
        mesh.geometry = nonIndexed;

        mesh.material.needsUpdate = true;
      }
    });
  }, [portals]);

  useFrame((state) => {
    Object.values(portalsRef).forEach((mesh) => {
      if (mesh.material.uniforms?.uTime) {
        mesh.material.uniforms.uTime.value = state.clock.elapsedTime;
        mesh.material.uniforms.uColorStart.value.set(colorStart);
        mesh.material.uniforms.uColorEnd.value.set(colorEnd);
      }
    });
  });

  useEffect(() => {
    if (onPortalsReady && Object.keys(portalsRef).length > 0) {
      onPortalsReady(portalsRef);
    }
  }, [portalsRef, onPortalsReady]);

  return <>
    <Environment preset="sunset"></Environment>

    <RigidBody 
      type="fixed" 
      colliders="trimesh"
    >
      <primitive object={ environment.scene }  scale={60}/>
    </RigidBody>

    <RigidBody 
      type="fixed" 
      colliders="hull"
    >
      <primitive object={ islands.scene }  scale={60} />
    </RigidBody>
    
    <RigidBody 
      type="fixed" 
      colliders="trimesh"
    >
      <primitive object={ vines.scene }  scale={60} />
    </RigidBody>

    <primitive object={portals.scene } scale={60}/>
    

    {environment?.scene && (
      <Fireflies
        target={environment.scene}
        count={150}
        spread={0.05}
        outward={0.2}
        size={130}
      />
    )}

    <Grass/>
  </>
}