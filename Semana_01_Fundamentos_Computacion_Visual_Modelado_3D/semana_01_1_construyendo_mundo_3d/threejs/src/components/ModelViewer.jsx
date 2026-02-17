import { useMemo, useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import * as THREE from 'three'

// ─── Geometrías procedurales ──────────────────────────────────────────────────
function buildGeometry(shape) {
  switch (shape) {
    case 'torusknot':   return new THREE.TorusKnotGeometry(1, 0.3, 128, 20)
    case 'torus':       return new THREE.TorusGeometry(1, 0.38, 32, 64)
    case 'sphere':      return new THREE.SphereGeometry(1, 48, 32)
    case 'box':         return new THREE.BoxGeometry(1.5, 1.5, 1.5, 4, 4, 4)
    case 'icosahedron': return new THREE.IcosahedronGeometry(1, 3)
    case 'cone':        return new THREE.ConeGeometry(1, 2, 32, 8)
    default:            return new THREE.TorusKnotGeometry(1, 0.3, 128, 20)
  }
}

// ─── Extraer estadísticas de una geometría ────────────────────────────────────
function getGeomStats(geom) {
  const vertices = geom.attributes.position.count
  const faces = geom.index
    ? Math.round(geom.index.count / 3)
    : Math.round(vertices / 3)
  // EdgesGeometry calcula aristas reales por ángulo umbral
  const edgesGeom = new THREE.EdgesGeometry(geom, 15)
  const edges = Math.round(edgesGeom.attributes.position.count / 2)
  edgesGeom.dispose()
  return { vertices, faces, edges }
}

// ─── Aplicar material según modo a un objeto Group ───────────────────────────
function applyMaterial(group, mode, color) {
  group.traverse((m) => {
    if (!m.isMesh) return
    switch (mode) {
      case 'faces':
        m.material = new THREE.MeshStandardMaterial({ color })
        break
      case 'edges':
        m.material = new THREE.MeshStandardMaterial({
          color,
          wireframe: true,
        })
        break
      case 'vertices':
        // OBJ agrupa muchas sub-mallas; mostrar wireframe muy tenue
        // como representación aproximada de la nube de puntos
        m.material = new THREE.MeshStandardMaterial({
          color: '#ffdd00',
          wireframe: true,
          transparent: true,
          opacity: 0.25,
        })
        break
      case 'all':
        m.material = new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: 0.55,
        })
        break
    }
  })
}

// ─── Sub-componente: carga OBJ (Eyeball) ─────────────────────────────────────
function OBJViewer({ mode, color, onInfoUpdate }) {
  const obj = useLoader(OBJLoader, '/eyeball.obj')

  // Estadísticas: para modelos OBJ grandes omitimos EdgesGeometry
  // (muy costoso) y estimamos aristas con la fórmula E ≈ 3F/2
  useEffect(() => {
    let totalVerts = 0
    let totalFaces = 0
    obj.traverse((m) => {
      if (!m.isMesh || !m.geometry) return
      const pos = m.geometry.attributes.position
      if (!pos) return
      totalVerts += pos.count
      totalFaces += m.geometry.index
        ? Math.round(m.geometry.index.count / 3)
        : Math.round(pos.count / 3)
    })
    onInfoUpdate({
      vertices: totalVerts,
      faces: totalFaces,
      edges: Math.round(totalFaces * 1.5),   // estimación Euler
    })
  }, [obj, onInfoUpdate])

  // Un clon para el fill (caras / todo)
  const solidClone = useMemo(() => obj.clone(true), [obj])
  // Un segundo clon independiente para la capa de aristas en modo "all"
  const wireClone  = useMemo(() => obj.clone(true), [obj])

  // Actualizar materiales del clon sólido
  useEffect(() => {
    applyMaterial(solidClone, mode, color)
  }, [solidClone, mode, color])

  // Actualizar clon wireframe (solo se muestra en modo 'all')
  useEffect(() => {
    wireClone.traverse((m) => {
      if (!m.isMesh) return
      m.material = new THREE.MeshBasicMaterial({
        color: '#ffffff',
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      })
    })
  }, [wireClone])

  return (
    <group>
      <primitive object={solidClone} />
      {/* Capa wireframe superpuesta solo en modo "todo" */}
      {mode === 'all' && <primitive object={wireClone} />}
    </group>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ModelViewer({ shape, mode, color, onInfoUpdate }) {
  const geometry = useMemo(() => {
    if (shape === 'obj') return null
    return buildGeometry(shape)
  }, [shape])

  // Notificar estadísticas cuando cambia la geometría procedural
  useEffect(() => {
    if (!geometry) return
    onInfoUpdate(getGeomStats(geometry))
  }, [geometry, onInfoUpdate])

  // ── Modo OBJ (Eyeball) ─────────────────────────────────────────────────────
  if (shape === 'obj') {
    return <OBJViewer mode={mode} color={color} onInfoUpdate={onInfoUpdate} />
  }

  // ── Geometría procedural ───────────────────────────────────────────────────
  const showFaces    = mode === 'faces'    || mode === 'all'
  const showEdges    = mode === 'edges'    || mode === 'all'
  const showVertices = mode === 'vertices' || mode === 'all'

  const faceMaterial = (
    <meshStandardMaterial
      color={color}
      polygonOffset
      polygonOffsetFactor={1}
      transparent={showEdges || showVertices}
      opacity={showEdges || showVertices ? 0.65 : 1}
    />
  )

  return (
    <group>
      {/* ── CARAS ─────────────────────────────────────────────────────────── */}
      {showFaces && (
        <mesh geometry={geometry}>
          {faceMaterial}
          {showEdges && (
            <Edges threshold={15} color="#ffffff" lineWidth={1} />
          )}
        </mesh>
      )}

      {/* ── SOLO ARISTAS (sin caras sólidas) ─────────────────────────────── */}
      {!showFaces && showEdges && (
        <mesh geometry={geometry}>
          <meshBasicMaterial color="#07102a" transparent opacity={0.10} />
          <Edges threshold={15} color="#00ccff" lineWidth={1.5} />
        </mesh>
      )}

      {/* ── VÉRTICES (puntos) ─────────────────────────────────────────────── */}
      {showVertices && (
        <points geometry={geometry}>
          <pointsMaterial
            color="#ffdd00"
            size={0.045}
            sizeAttenuation
            depthTest={false}
          />
        </points>
      )}
    </group>
  )
}
