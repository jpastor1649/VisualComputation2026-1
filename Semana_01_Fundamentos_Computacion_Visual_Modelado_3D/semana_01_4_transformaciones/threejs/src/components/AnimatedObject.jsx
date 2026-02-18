import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AnimatedObject() {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const t = clock.elapsedTime

    /* ========================================
       1. TRASLACIÓN: Trayectoria circular
       ======================================== */
    const radius = 3
    const speed = 0.5
    meshRef.current.position.x = Math.cos(t * speed) * radius
    meshRef.current.position.y = Math.sin(t * speed * 0.7) * radius * 0.5
    meshRef.current.position.z = Math.sin(t * speed) * radius

    /* ========================================
       2. ROTACIÓN: Continua sobre su propio eje
       ======================================== */
    meshRef.current.rotation.x += 0.01
    meshRef.current.rotation.y += 0.015
    meshRef.current.rotation.z += 0.005

    /* ========================================
       3. ESCALADO: Función sinusoidal
       ======================================== */
    const scale = 1 + Math.sin(t * 2) * 0.5
    meshRef.current.scale.set(scale, scale, scale)
  })

  return (
    <group ref={meshRef}>
      {/* Cubo principal */}
      <mesh geometry={new THREE.BoxGeometry(1, 1, 1)}>
        <meshStandardMaterial 
          color="#00ff88"
          emissive="#00aa44"
          emissiveIntensity={0.3}
          wireframe={false}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Esfera dentro del cubo como referencia visual */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#ff00ff"
          emissive="#ff0088"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Aristas visibles para resaltar las transformaciones */}
      <lineSegments>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([
              // Aristas del cubo
              -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
              0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
              0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
              -0.5, 0.5, -0.5, -0.5, -0.5, -0.5,
              -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
              0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
              0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
              -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,
              -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
              0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
              0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
              -0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
            ])}
            count={24}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffff00" linewidth={2} />
      </lineSegments>
    </group>
  )
}
