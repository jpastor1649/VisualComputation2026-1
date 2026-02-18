import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

function HierarchyDemo() {
  const parentGroupRef = useRef()
  const childGroupRef = useRef()
  const grandchildRef = useRef()

  const { parentRotX, parentRotY, parentRotZ, parentPosX, parentPosY, parentPosZ,
    childRotX, childRotY, childRotZ, childPosX, childPosY, childPosZ,
    grandchildRotX, grandchildRotY, grandchildRotZ, grandchildPosX, grandchildPosY, grandchildPosZ,
    autoRotate } = useControls({
    // Controles del Padre (Nivel 1)
    parentRotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    parentRotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    parentRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    parentPosX: { value: 0, min: -10, max: 10, step: 0.1 },
    parentPosY: { value: 0, min: -10, max: 10, step: 0.1 },
    parentPosZ: { value: 0, min: -10, max: 10, step: 0.1 },
    // Controles del Hijo (Nivel 2)
    childRotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    childRotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    childRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    childPosX: { value: 4, min: -10, max: 10, step: 0.1 },
    childPosY: { value: 0, min: -10, max: 10, step: 0.1 },
    childPosZ: { value: 0, min: -10, max: 10, step: 0.1 },
    // Controles del Nieto (Nivel 3)
    grandchildRotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    grandchildRotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    grandchildRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    grandchildPosX: { value: 3, min: -10, max: 10, step: 0.1 },
    grandchildPosY: { value: 0, min: -10, max: 10, step: 0.1 },
    grandchildPosZ: { value: 0, min: -10, max: 10, step: 0.1 },
    // Auto-rotar
    autoRotate: false,
  })

  useFrame(() => {
    if (parentGroupRef.current) {
      // Posición y rotación del padre
      parentGroupRef.current.position.set(parentPosX, parentPosY, parentPosZ)
      parentGroupRef.current.rotation.order = 'XYZ'
      parentGroupRef.current.rotation.x = parentRotX
      parentGroupRef.current.rotation.y = parentRotY
      parentGroupRef.current.rotation.z = parentRotZ

      // Auto-rotación si está habilitada
      if (autoRotate) {
        parentGroupRef.current.rotation.y += 0.005
      }
    }

    if (childGroupRef.current) {
      // Posición y rotación del hijo (relativa al padre)
      childGroupRef.current.position.set(childPosX, childPosY, childPosZ)
      childGroupRef.current.rotation.order = 'XYZ'
      childGroupRef.current.rotation.x = childRotX
      childGroupRef.current.rotation.y = childRotY
      childGroupRef.current.rotation.z = childRotZ
    }

    if (grandchildRef.current) {
      // Posición y rotación del nieto (relativa al hijo)
      grandchildRef.current.position.set(grandchildPosX, grandchildPosY, grandchildPosZ)
      grandchildRef.current.rotation.order = 'XYZ'
      grandchildRef.current.rotation.x = grandchildRotX
      grandchildRef.current.rotation.y = grandchildRotY
      grandchildRef.current.rotation.z = grandchildRotZ
    }
  })

  return (
    <group ref={parentGroupRef}>
      {/* PADRE (Nivel 1) - Cubo rojo */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#ff6b6b" wireframe={false} />
      </mesh>

      {/* HIJO (Nivel 2) - Grupo hijo con cilindro azul y esfera */}
      <group ref={childGroupRef}>
        {/* Cilindro azul - hijo directo */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
          <meshStandardMaterial color="#4ecdc4" />
        </mesh>

        {/* NIETO (Nivel 3) - Esfera verde dentro del grupo hijo */}
        <group ref={grandchildRef}>
          {/* Esfera verde - nieto */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial color="#95e1d3" />
          </mesh>

          {/* Pequeño cubo amarillo - gran-nieto opcional para más complejidad */}
          <mesh position={[2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#ffd93d" />
          </mesh>
        </group>
      </group>

      {/* Líneas visuales para ver la jerarquía */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="positions" array={new Float32Array([
            // Línea del padre al hijo
            0, 0, 0,
            childPosX, childPosY, childPosZ,
            // Línea del hijo al nieto
            childPosX, childPosY, childPosZ,
            childPosX + grandchildPosX, childPosY + grandchildPosY, childPosZ + grandchildPosZ,
          ])} count={4} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" linewidth={2} opacity={0.3} />
      </lineSegments>
    </group>
  )
}

export default HierarchyDemo
