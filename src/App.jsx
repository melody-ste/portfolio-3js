import './styles/App.css';
import { Canvas } from '@react-three/fiber';
import Footer from './components/Footer';
import Experience from './components/Experience.jsx'
import Grass from './components/Grass.jsx'

function App() {
 
  return (
    <>
      <Canvas>
        <Grass />
        <Experience />
      </Canvas>
      <Footer />
    </>
  )
}

export default App
