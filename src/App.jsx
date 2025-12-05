import './styles/App.css';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls} from '@react-three/drei'
import { useState } from "react"
import * as THREE from "three"

import Footer from './components/Footer';
import Experience from './components/Experience.jsx'
import Interface from './components/Interface.jsx'
import MouseDragLook from './components/MouseDragLook.jsx'
import Resume from "./components/Resume";

function App() {

  const [headerVisible, setHeaderVisible] = useState(true)
  const [showCard, setShowCard] = useState(false)

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
          <Experience headerVisible={headerVisible} setHeaderVisible={setHeaderVisible} showCard={showCard} setShowCard={setShowCard} />
        </Canvas>

        <Interface headerVisible={headerVisible} />

        {showCard && (
          <div className="resume-container-wrapper">
            <div className="resume-container">
              <div className="resume-card">
                <button className="resume-close" onClick={() => setShowCard(false)}>✕</button>
                <Resume />
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </KeyboardControls>
    </>
  )
}

export default App
