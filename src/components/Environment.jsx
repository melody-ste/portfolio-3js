import { useEffect } from "react";
import { useGLTF } from '@react-three/drei'
import Grass from "./Grass";

export default function Environment()
{
  const environment = useGLTF('/enviro.glb');

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
      rocks1.position.set(5, 0, -3);
      // rocks1.rotation.set(0, Math.PI / 4, 0);
      rocks1.scale.set(1.2, 1.2, 1.2);
    }

    if (rocks2) {
      rocks2.position.set(9, 0, 0);
      // rocks2.rotation.set(0, Math.PI / 4, 0);
      rocks2.scale.set(1.2, 1.2, 1.2);
    }

    if (rocks3) {
      rocks3.position.set(7, 0, 0);
      // rocks3.rotation.set(0, Math.PI / 4, 0);
      rocks3.scale.set(1.2, 1.2, 1.2);
    }

    if (sign) {
      sign.position.set(-2, 0, 4);
    }

    if (mush1) {
      mush1.position.set(5, 0, -3);
    }
  }, [environment]);

  // console.log(environment.scene);
  // console.log("CHILDREN:", environment.scene.children);
  
  return <>
    <primitive object={ environment.scene } />
    <Grass />
  </>
}