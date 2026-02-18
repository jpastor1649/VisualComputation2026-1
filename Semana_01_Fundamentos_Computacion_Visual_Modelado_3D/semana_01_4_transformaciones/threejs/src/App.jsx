import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import AnimatedObject from './components/AnimatedObject'

export default function App() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      
      {/* Iluminación */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff00ff" />
      
      {/* Objeto 3D animado */}
      <AnimatedObject />
      
      {/* Controles de órbita */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
      />
      
      {/* Plano de fondo simple */}
      <gridHelper args={[20, 20]} />
    </Canvas>
  )
}
