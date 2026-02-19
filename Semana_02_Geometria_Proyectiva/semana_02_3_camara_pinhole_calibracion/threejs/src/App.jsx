import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Scene3D } from './components/Scene3D'
import { ControlPanel } from './components/ControlPanel'
import './App.css'

function App() {
  const [cameraParams, setCameraParams] = useState({
    fov: 75,
    near: 0.1,
    far: 100,
    posX: 0,
    posY: 0,
    posZ: 5
  })
  
  const [distortionParams, setDistortionParams] = useState({
    k1: 0,
    k2: 0
  })
  
  const [showFrustum, setShowFrustum] = useState(true)
  const [projections, setProjections] = useState([])
  
  return (
    <div className="app">
      <Canvas
        camera={{
          position: [cameraParams.posX, cameraParams.posY, cameraParams.posZ],
          fov: cameraParams.fov,
          near: cameraParams.near,
          far: cameraParams.far,
          aspect: window.innerWidth / window.innerHeight,
        }}
        gl={{
          antialias: true,
          shadowMap: { enabled: true },
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <pointLight position={[-5, 5, 5]} intensity={0.4} />
        
        <Scene3D
          cameraParams={cameraParams}
          showFrustum={showFrustum}
          distortionParams={distortionParams}
          onProjections={setProjections}
        />
      </Canvas>
      
      <ControlPanel
        cameraParams={cameraParams}
        setCameraParams={setCameraParams}
        distortionParams={distortionParams}
        setDistortionParams={setDistortionParams}
        showFrustum={showFrustum}
        setShowFrustum={setShowFrustum}
        projections={projections}
      />
    </div>
  )
}

export default App
