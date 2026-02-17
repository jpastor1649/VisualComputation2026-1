import { useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, GizmoHelper, GizmoViewport } from '@react-three/drei'
import ModelViewer from './components/ModelViewer'
import './index.css'

// ─── Constantes de UI ─────────────────────────────────────────────────────────
const SHAPES = [
  { id: 'torusknot',   label: 'Torus Knot'  },
  { id: 'torus',       label: 'Toro'         },
  { id: 'sphere',      label: 'Esfera'       },
  { id: 'box',         label: 'Cubo'         },
  { id: 'icosahedron', label: 'Icosaedro'    },
  { id: 'cone',        label: 'Cono'         },
  { id: 'obj',         label: 'Eyeball OBJ'   },
]

const MODES = [
  { id: 'faces',    label: 'Caras',    icon: '◼', color: '#4488ff' },
  { id: 'edges',    label: 'Aristas',  icon: '◻', color: '#00ccff' },
  { id: 'vertices', label: 'Vértices', icon: '·',  color: '#ffdd00' },
  { id: 'all',      label: 'Todo',     icon: '⬡', color: '#bb88ff' },
]

// ─── Loading fallback ─────────────────────────────────────────────────────────
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 12, 12]} />
      <meshBasicMaterial color="#4488ff" wireframe />
    </mesh>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode,  setMode]  = useState('faces')
  const [shape, setShape] = useState('torusknot')
  const [color, setColor] = useState('#4488ff')
  const [info,  setInfo]  = useState({ vertices: 0, faces: 0, edges: 0 })

  // Callback estable para evitar re-renders en bucle
  const handleInfo = useCallback((data) => setInfo(data), [])

  const activeMode = MODES.find(m => m.id === mode)

  return (
    <div className="app-root">
      {/* ── Canvas 3D ──────────────────────────────────────────────────── */}
      <Canvas
        camera={{ position: [4, 3, 4], fov: 50 }}
        style={{ background: '#0d1117' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]}   intensity={1.5} castShadow />
        <directionalLight position={[-8, -4, -5]}   intensity={0.4} />
        <pointLight       position={[0, 4, 0]}      intensity={0.6} color="#8080ff" />

        <Suspense fallback={<Loader />}>
          <Center>
            <ModelViewer
              shape={shape}
              mode={mode}
              color={color}
              onInfoUpdate={handleInfo}
            />
          </Center>
        </Suspense>

        <OrbitControls makeDefault enablePan enableZoom enableRotate />
        <gridHelper args={[12, 12, '#1e2a3a', '#141e2a']} />

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>

      {/* ── Panel de control ────────────────────────────────────────────── */}
      <aside className="ui-panel">
        {/* Título */}
        <div className="panel-header">
          <span className="panel-logo">⬡</span>
          <div>
            <h1 className="panel-title">3D Viewer</h1>
            <p className="panel-subtitle">React Three Fiber</p>
          </div>
        </div>

        {/* Información del modelo */}
        <section className="panel-section">
          <h2 className="section-title">Información del modelo</h2>
          <div className="info-grid">
            <div className="info-card" style={{ '--accent': '#ffdd00' }}>
              <span className="info-label">Vértices</span>
              <span className="info-value">{info.vertices.toLocaleString('es')}</span>
            </div>
            <div className="info-card" style={{ '--accent': '#00ccff' }}>
              <span className="info-label">Aristas</span>
              <span className="info-value">{info.edges.toLocaleString('es')}</span>
            </div>
            <div className="info-card" style={{ '--accent': '#4488ff' }}>
              <span className="info-label">Caras</span>
              <span className="info-value">{info.faces.toLocaleString('es')}</span>
            </div>
          </div>
        </section>

        {/* Modo de visualización */}
        <section className="panel-section">
          <h2 className="section-title">Modo de visualización</h2>
          <div className="mode-grid">
            {MODES.map(m => (
              <button
                key={m.id}
                className={`mode-btn ${mode === m.id ? 'mode-btn--active' : ''}`}
                style={{ '--mode-color': m.color }}
                onClick={() => setMode(m.id)}
              >
                <span className="mode-icon">{m.icon}</span>
                <span className="mode-label">{m.label}</span>
              </button>
            ))}
          </div>
          <p className="mode-desc">
            Modo activo: <strong style={{ color: activeMode.color }}>{activeMode.label}</strong>
          </p>
        </section>

        {/* Selección de forma */}
        <section className="panel-section">
          <h2 className="section-title">Geometría</h2>
          <div className="shape-grid">
            {SHAPES.map(s => (
              <button
                key={s.id}
                className={`shape-btn ${shape === s.id ? 'shape-btn--active' : ''}`}
                onClick={() => setShape(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          {shape === 'obj' && (
            <p className="gltf-note">
              Modelo <code>eyeball.obj</code> cargado desde <code>public/</code>
            </p>
          )}
        </section>

        {/* Color */}
        <section className="panel-section">
          <h2 className="section-title">Color del modelo</h2>
          <div className="color-row">
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="color-picker"
            />
            <span className="color-value">{color.toUpperCase()}</span>
          </div>
        </section>

        {/* Atajos de cámara */}
        <section className="panel-section controls-help">
          <h2 className="section-title">Controles de cámara</h2>
          <ul>
            <li><kbd>Arrastrar</kbd> Rotar</li>
            <li><kbd>Scroll</kbd> Zoom</li>
            <li><kbd>Clic Der</kbd> Pan</li>
          </ul>
        </section>
      </aside>
    </div>
  )
}
