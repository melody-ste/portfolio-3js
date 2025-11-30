import './styles/App.css';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei'
import Footer from './components/Footer';
import Experience from './components/Experience.jsx'
import Interface from './components/Interface.jsx'

function App() {
 
  return (
    <>
      <KeyboardControls 
      map={ [
        { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
        { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
        { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
        { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
        { name: 'jump', keys: [ 'Space' ] },
      ] }>
        <Canvas
          camera={{
          position: [0, 2, 12],
          rotation: [0, 0, 0],
          fov: 45,
          near: 0.1,
          far: 200
        }}>
          <Experience />
        </Canvas>

        <Interface />
        <Footer />
      </KeyboardControls>
    </>
  )
}

export default App
