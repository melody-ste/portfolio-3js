import { useKeyboardControls } from "@react-three/drei"

export default function Interface({ headerVisible })
{
  return (
    <div className="interface">
      <header className={headerVisible ? "" : "hidden"}>
        <h1 className="title">Mélody Stephan</h1>
        <h2>Frontend Web Developer & 3D Generalist</h2>
      </header>

      <div className={`controls ${headerVisible ? "" : "hidden"}`}>
        <p className="keyboard-hint">
          Use the keyboard arrows to move
        </p>
        <div className="raw">
          <div className="arrow forward "></div>
        </div>
        <div className="raw">
          <div className="arrow leftward"></div>
          <div className="arrow backward"></div>
          <div className="arrow rightward"></div>
        </div>
      </div>

    </div>
  )
}
