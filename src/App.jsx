import './styles/App.css';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls} from '@react-three/drei'
import { useState } from "react"
import * as THREE from "three"

import Footer from './components/Footer';
import Experience from './components/Experience.jsx'
import Interface from './components/Interface.jsx'
import MouseDragLook from './components/MouseDragLook.jsx'

function App() {

  const [headerVisible, setHeaderVisible] = useState(true)

  return (
    <>
      <KeyboardControls 
      map={ [
        { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
        { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
        { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
        { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
      ] }>
        <Canvas
          camera={{
          position: [-4, 2, 15],
          rotation: [0, 0, 0],
          fov: 45,
          near: 0.1,
          far: 200
        }}
        >
          <MouseDragLook />
          <Experience headerVisible={headerVisible} setHeaderVisible={setHeaderVisible} />
        </Canvas>

        <Interface headerVisible={headerVisible} />
        <Footer />
      </KeyboardControls>
    </>
  )
}

export default App
