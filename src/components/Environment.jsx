import { useGLTF } from '@react-three/drei'

import Grass from "./Grass";

export default function Environment()
{
  const environment = useGLTF('/enviro.glb');

  return <>
    <primitive object={ environment.scene } />
    <Grass />
  </>
}