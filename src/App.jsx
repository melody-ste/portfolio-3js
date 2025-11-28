import './styles/App.css';
import { Canvas } from '@react-three/fiber';
import Footer from './components/Footer';
import Experience from './components/Experience.jsx'
import Grass from './components/Grass.jsx'
import Environment from './components/Environment.jsx';

function App() {
 
  return (
    <>
      <Canvas>
        <Environment />
        <Experience />
      </Canvas>
      <Footer />
    </>
  )
}

export default App
