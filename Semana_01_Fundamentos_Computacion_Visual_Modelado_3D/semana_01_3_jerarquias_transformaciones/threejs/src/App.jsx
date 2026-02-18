import { Canvas } from '@react-three/fiber'
import HierarchyDemo from './HierarchyDemo'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ width: '100%', height: '100vh' }}
      >
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <HierarchyDemo />
      </Canvas>
    </div>
  )
}

export default App
