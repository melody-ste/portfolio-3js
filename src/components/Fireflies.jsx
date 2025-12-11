import * as THREE from 'three'
import { useMemo, useEffect, useRef} from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import firefliesVertex from "../shaders/fireflies/vertex.glsl?raw";
import firefliesFragment from "../shaders/fireflies/fragment.glsl?raw";

export default function Fireflies({
  target = null,
  count = 150,
  spread = 0.05,
  outward = 0.6,
  size = 200,
}) {

  const materialRef = useRef()

  const geometry = useMemo(() => {
    if (!target) return null

    const geoms = []
    const tmpMat = new THREE.Matrix4()
    const scale = 60;
    target.scale.set(scale, scale, scale);

    target.updateMatrixWorld(true)

    target.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const g = child.geometry.clone()
        tmpMat.copy(child.matrixWorld)
        g.applyMatrix4(tmpMat)

        if (!g.attributes.normal) g.computeVertexNormals()
        geoms.push(g)
      }
    })

    if (geoms.length === 0) return null

    const merged = BufferGeometryUtils.mergeGeometries(geoms, true)
    if (!merged.attributes.normal) merged.computeVertexNormals()

    const samplingMesh = new THREE.Mesh(merged)

    const sampler = new MeshSurfaceSampler(samplingMesh).build()

    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const tmpPos = new THREE.Vector3()
    const tmpNormal = new THREE.Vector3()

    for (let i = 0; i < count; i++) {
      sampler.sample(tmpPos, tmpNormal)

      const randX = (Math.random() - 0.5) * spread
      const randZ = (Math.random() - 0.5) * spread

      const outwardOffset = outward * (0.8 + Math.random() * 0.8)

      const finalPos = tmpPos.clone()
      finalPos.x += randX
      finalPos.z += randZ
      finalPos.addScaledVector(tmpNormal, outwardOffset)

      positions[i * 3 + 0] = finalPos.x
      positions[i * 3 + 1] = finalPos.y
      positions[i * 3 + 2] = finalPos.z

      scales[i] = 0.5 + Math.random() * 1.2

      const r = 0.8 + Math.random() * 0.2
      const g = 0.3 + Math.random() * 0.1
      const b = 1.0

      colors[i * 3 + 0] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geom.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))

    return geom
  }, [target, count, spread, outward])

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: firefliesVertex,
      fragmentShader: firefliesFragment,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uSize: { value: size },
        uTime: { value: 0 }
      }
    })
    return mat
  }, [size])

  useEffect(() => {
    materialRef.current = material
    return () => {
      if (material) {
        material.dispose()
      }
    }
  }, [material])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  useEffect(() => {
    const onResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!geometry) return null

  return <points geometry={geometry} material={material} />
}
