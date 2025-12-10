import './styles/App.css';
import './styles/resume.css';
import './styles/projects.css';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls} from '@react-three/drei'
import { useState } from "react"
import * as THREE from "three"

import Footer from './components/Footer';
import Experience from './components/Experience.jsx'
import Interface from './components/Interface.jsx'
import MouseDragLook from './components/MouseDragLook.jsx'
import Resume from "./components/Resume";
import Projects from "./components/Projects";

function App() {

  const [headerVisible, setHeaderVisible] = useState(true)
  const [showCard, setShowCard] = useState(false)
  const [showCardProjects, setShowCardProjects] = useState(false)

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
          rotation: [0, 0, 0],
          fov: 45,
          near: 0.1,
          far: 200
        }}
        >
          <MouseDragLook />
          <Experience
            headerVisible={headerVisible}
            setHeaderVisible={setHeaderVisible}
            showCard={showCard} 
            setShowCard={setShowCard} 
            showCardProjects={showCardProjects} 
            setShowCardProjects={setShowCardProjects} 
          />
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

        {showCardProjects && (
          <div className="resume-container-wrapper">
            <div className="resume-container">
              <div className="resume-card">
                <button className="resume-close" onClick={() => setShowCardProjects(false)}>✕</button>
                <Projects />
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
