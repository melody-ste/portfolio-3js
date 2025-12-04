import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as THREE from "three";

import grassVertex from "../shaders/grass/vertex.glsl?raw";
import grassFragment from "../shaders/grass/fragment.glsl?raw";

export default function Grass() {

  const bladeCount = 500000;
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

  // Sampling the surface of the ground
  const instancedGeometry = useMemo(() => {
    if (!ground?.scene) return null;

    // Clone + scale
    const scaledScene = ground.scene.clone();
    scaledScene.scale.set(60, 60, 60);
    scaledScene.updateMatrixWorld(true);

    const geometries = [];

    scaledScene.traverse(child => {
      if (child.isMesh) {
        const geom = child.geometry.clone();
        geom.applyMatrix4(child.matrixWorld); // bake world transform
        geometries.push(geom);
      }
    });

    if (geometries.length === 0) return null;

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, true);

    const meshForSampling = new THREE.Mesh(mergedGeometry);

    const sampler = new MeshSurfaceSampler(meshForSampling)
      .setWeightAttribute(null)
      .build();

    // --- Instances ---
    const offsets = new Float32Array(bladeCount * 3);
    const heights = new Float32Array(bladeCount);
    const yaws = new Float32Array(bladeCount);
    const bends = new Float32Array(bladeCount);

    const tmp = new THREE.Vector3();

    for (let i = 0; i < bladeCount; i++) {
      sampler.sample(tmp);

      offsets[i * 3 + 0] = tmp.x;
      offsets[i * 3 + 1] = tmp.y;
      offsets[i * 3 + 2] = tmp.z;

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

    instGeom.instanceCount = bladeCount;

    return instGeom;
  }, [ground, baseGeometry]);


  // UPDATE TIME
  useFrame((state) => {
    uniforms.iTime.value = state.clock.getElapsedTime() * 1000;
  });

  if (!instancedGeometry) return null;

  return (
    <mesh geometry={instancedGeometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={grassVertex}
        fragmentShader={grassFragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}