import { useKeyboardControls } from "@react-three/drei"
import '../styles/interface.css';
import Navbar from "./Navbar";

export default function Interface({ headerVisible })
{
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)

    return (
      <div className="interface">
        <Navbar />

        {headerVisible && (
          <header>
            <h1 className="title">Mélody Stephan</h1>
            <h2>Frontend Web Developer & 3D Generalist</h2>
          </header>
        )}

        <div className="controls">
          <div className="raw">
            <div className={`key ${forward ? "active" : ""}`}></div>
          </div>
          <div className="raw">
            <div className={`key ${leftward ? "active" : ""}`}></div>
            <div className={`key ${backward ? "active" : ""}`}></div>
            <div className={`key ${rightward ? "active" : ""}`}></div>
          </div>
        </div>

      </div>
    )
}
