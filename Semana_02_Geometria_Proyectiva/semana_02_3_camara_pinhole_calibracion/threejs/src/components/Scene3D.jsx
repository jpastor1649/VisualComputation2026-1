import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { getFrustumPoints, createFrustumGeometry, applyRadialDistortion, project3DTo2D } from '../utils/cameraUtils'

export function Scene3D({ cameraParams, showFrustum, distortionParams, onProjections }) {
  const { camera, scene, gl } = useThree()
  const sceneRef = useRef()
  const frustumLineRef = useRef()
  const projectionPointsRef = useRef([])
  
  // Actualizar parámetros de cámara
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = cameraParams.fov
      camera.near = cameraParams.near
      camera.far = cameraParams.far
      camera.position.set(cameraParams.posX, cameraParams.posY, cameraParams.posZ)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
  }, [cameraParams, camera])
  
  // Actualizar frustum
  useEffect(() => {
    if (showFrustum && frustumLineRef.current) {
      const corners = getFrustumPoints(camera)
      const geometry = createFrustumGeometry(corners)
      frustumLineRef.current.geometry.dispose()
      frustumLineRef.current.geometry = geometry
    }
  }, [showFrustum, cameraParams, camera])
  
  // Actualizar proyecciones
  useFrame(() => {
    // Calcular proyecciones de puntos conocidos
    const testPoints = [
      new THREE.Vector3(0, 0, 0), // Centro
      new THREE.Vector3(2, 0, 0), // Cubo rojo
      new THREE.Vector3(-2, 0, 0), // Cubo azul
      new THREE.Vector3(0, 2, 0), // Esfera
      new THREE.Vector3(0, -2, 0), // Torus
      new THREE.Vector3(2, 2, 0), // Cono
    ]
    
    const projections = testPoints.map(point => {
      const screen = project3DTo2D(point, camera, gl.domElement.clientWidth, gl.domElement.clientHeight)
      
      // Normalizar a [-1, 1]
      const normalized = new THREE.Vector2(
        (screen.x / gl.domElement.clientWidth) * 2 - 1,
        -(screen.y / gl.domElement.clientHeight) * 2 + 1
      )
      
      // Aplicar distorsión
      const distorted = applyRadialDistortion(normalized, distortionParams.k1, distortionParams.k2)
      
      return { original: screen, distorted, worldPos: point }
    })
    
    if (onProjections) onProjections(projections)
  })
  
  return (
    <group ref={sceneRef}>
      {/* Grid */}
      <Grid args={[10, 10]} cellSize={0.5} cellColor="#6f6f6f" sectionSize={2} sectionColor="#9d4edd" fadeDistance={30} />
      
      {/* Objetos conocidos */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#0000ff" />
      </mesh>
      
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#00ff00" />
      </mesh>
      
      <mesh position={[0, -2, 0]}>
        <torusGeometry args={[0.5, 0.2, 16, 100]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      
      <mesh position={[2, 2, 0]}>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>
      
      {/* Origen - pequeña esfera */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Ejes */}
      <line position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([-2, 0, 0, 2, 0, 0])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#ff0000" linewidth={2} />
      </line>
      
      <line position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([0, -2, 0, 0, 2, 0])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#00ff00" linewidth={2} />
      </line>
      
      <line position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([0, 0, -2, 0, 0, 2])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#0000ff" linewidth={2} />
      </line>
      
      {/* Frustum */}
      {showFrustum && (
        <line ref={frustumLineRef}>
          <bufferGeometry />
          <lineBasicMaterial color="#ffff00" linewidth={1} />
        </line>
      )}
      
      {/* Controles de órbita */}
      <OrbitControls makeDefault minDistance={3} maxDistance={20} />
    </group>
  )
}
