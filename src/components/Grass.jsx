import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import grassVertex from "../shaders/grass/vertex.glsl?raw";
import grassFragment from "../shaders/grass/fragment.glsl?raw";

export default function Grass() {

  const bladeCount = 1500000;
  const ground = useGLTF('/grass.glb');

  // UNIFORMS
  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
    }),
    []
  );

  // BASE BLADE GEOMETRY 
  const baseGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    const positions = new Float32Array([
      -0.05, 0, 0, // bl
      0.05, 0, 0, // br
      0.03, 0.4, 0, // tr
      -0.03, 0.4, 0, // tl
      0, 0.8, 0, // tip
    ]);

    const indices = new Uint16Array([
      0, 1, 2,
      2, 4, 3,
      3, 0, 2,
    ]);

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));

    return geom;
  }, []);

  const instancedGeometry = useMemo(() => {
    if (!ground?.scene) return null;

    const scaledScene = ground.scene.clone();
    scaledScene.scale.set(60, 60, 60);
    scaledScene.updateMatrixWorld(true);

    const positionsArray = [];

    scaledScene.traverse((child) => {
      if (child.isMesh && child.geometry && child.geometry.attributes.position) {
        const posAttr = child.geometry.attributes.position;

        for (let i = 0; i < posAttr.count; i++) {
          const tempPos = new THREE.Vector3().fromBufferAttribute(posAttr, i);
          tempPos.applyMatrix4(child.matrixWorld);
          positionsArray.push(tempPos.x, tempPos.y, tempPos.z);
        }
      }
    });

    // limite à bladeCount et choisis aléatoirement
    const instanceCount = Math.min(bladeCount, positionsArray.length / 3);
    const offsets = new Float32Array(instanceCount * 3);
    const heights = new Float32Array(instanceCount);
    const yaws = new Float32Array(instanceCount);
    const bends = new Float32Array(instanceCount);

    for (let i = 0; i < instanceCount; i++) {
      const idx = Math.floor(Math.random() * (positionsArray.length / 3));
      offsets[i * 3 + 0] = positionsArray[idx * 3 + 0];
      offsets[i * 3 + 1] = positionsArray[idx * 3 + 1];
      offsets[i * 3 + 2] = positionsArray[idx * 3 + 2];

      heights[i] = 0.5 + Math.random() * 0.6;
      yaws[i] = Math.random() * Math.PI * 2;
      bends[i] = Math.random() * Math.PI * 2;
    }

    const instGeom = new THREE.InstancedBufferGeometry();
    instGeom.index = baseGeometry.index;
    instGeom.attributes.position = baseGeometry.attributes.position;
    instGeom.setAttribute("instanceOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    instGeom.setAttribute("instanceHeight", new THREE.InstancedBufferAttribute(heights, 1));
    instGeom.setAttribute("instanceYaw", new THREE.InstancedBufferAttribute(yaws, 1));
    instGeom.setAttribute("instanceBend", new THREE.InstancedBufferAttribute(bends, 1));
    instGeom.instanceCount = instanceCount;

    return instGeom;
  }, [baseGeometry, ground]);

  // UPDATE TIME
  useFrame((state) => {
    uniforms.iTime.value = state.clock.getElapsedTime() * 1000;
  });

  if (!instancedGeometry) return null;

  return (
    <mesh geometry={instancedGeometry}>
      <shaderMaterial
        vertexShader={grassVertex}
        fragmentShader={grassFragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}