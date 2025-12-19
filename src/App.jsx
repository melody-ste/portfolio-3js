import './styles/App.css';
import './styles/resume.css';
import './styles/projects.css';
import './styles/interface.css';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls} from '@react-three/drei'
import { useState, useEffect, useRef } from "react"
import { HelmetProvider, Helmet } from "react-helmet-async";
import * as THREE from "three"

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Experience from './components/Experience.jsx'
import Interface from './components/Interface.jsx'
import MouseDragLook from './components/MouseDragLook.jsx'
import Resume from "./components/Resume";
import Projects from "./components/Projects";

function App() {
  const [headerVisible, setHeaderVisible] = useState(true)
  const [showCard, setShowCard] = useState(false)
  const [showCardProjects, setShowCardProjects] = useState(false)

  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const [playerActions, setPlayerActions] = useState(null)

  useEffect(() => {
    let raf;
    const animate = () => {
      setProgress(prev => {
        const next = Math.min(prev + 0.015, 1);
        if (next === 1) setIsLoaded(true);
        return next;
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Portfolio | Melody Stephan</title>
          <meta
            name="description"
            content="Welcome to my interactive portfolio, where you can explore three floating islands and discover my skills and projects."
          />
          <link rel="canonical" href="https://portfolio-melody-stephan.vercel.app/" />
        </Helmet>

        {!isLoaded && (
          <div className="loading-screen">
            <div className="loading-bar-bg">
              <div
                className="loading-bar-fill"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
            <p className="loading-label">{Math.round(progress * 100)}%</p>
          </div>
        )}
        <KeyboardControls 
        map={ [
          { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
          { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
          { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
          { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
        ] }>
          <Canvas
            tabIndex={0}
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
              onPlayerReady={setPlayerActions}
            />
          </Canvas>

          <Navbar actions={playerActions} />
          <Interface headerVisible={headerVisible} />

          {showCard && (
            <div className="resume-container-wrapper" tabIndex={-1}>
              <div className="resume-container">
                <div className="resume-card">
                  <button className="resume-close" onClick={() => setShowCard(false)}>✕</button>
                  <Resume />
                </div>
              </div>
            </div>
          )}

          {showCardProjects && (
            <div className="resume-container-wrapper" tabIndex={-1}>
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
      </HelmetProvider>
    </>
  )
}

export default App
