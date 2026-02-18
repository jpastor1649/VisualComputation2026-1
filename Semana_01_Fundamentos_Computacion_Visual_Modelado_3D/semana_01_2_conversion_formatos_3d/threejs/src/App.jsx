import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ModelViewer from './components/ModelViewer';
import ModelInfo from './components/ModelInfo';
import './App.css';

export default function App() {
  const [selectedModel, setSelectedModel] = useState('obj');
  const [modelInfo, setModelInfo] = useState(null);

  const models = {
    obj: {
      name: 'Eyeball (OBJ)',
      path: '/media/eyeball.obj',
      format: 'OBJ',
      description: 'Formato OBJ - Polygon File Format'
    },
    stl: {
      name: 'Eyeball (STL)',
      path: '/media/eyeball.stl',
      format: 'STL',
      description: 'Formato STL - Stereolithography'
    },
    gltf: {
      name: 'Duck (GLB)',
      path: '/media/Duck.glb',
      format: 'GLB',
      description: 'Formato GLB - Binary GL Transmission Format'
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Visualizador de Modelos 3D</h1>
        <p>Compara diferentes formatos de modelos 3D</p>
      </header>

      <div className="content">
        <aside className="sidebar">
          <div className="model-selector">
            <h2>Seleccionar Modelo</h2>
            <div className="button-group">
              {Object.entries(models).map(([key, model]) => (
                <button
                  key={key}
                  className={`model-btn ${selectedModel === key ? 'active' : ''}`}
                  onClick={() => setSelectedModel(key)}
                >
                  <span className="format">{model.format}</span>
                  <span className="name">{model.name}</span>
                </button>
              ))}
            </div>
          </div>

          <ModelInfo modelInfo={modelInfo} model={models[selectedModel]} />

          <div className="controls-info">
            <h3>Controles</h3>
            <ul>
              <li><strong>Rotar:</strong> Click izquierdo + arrastrar</li>
              <li><strong>Zoom:</strong> Rueda del ratón</li>
              <li><strong>Mover:</strong> Click derecho + arrastrar</li>
            </ul>
          </div>
        </aside>

        <main className="canvas-container">
          <Canvas
            camera={{ position: [0, 0, 100], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <ModelViewer
              modelKey={selectedModel}
              modelPath={models[selectedModel].path}
              onModelLoaded={setModelInfo}
            />
          </Canvas>
        </main>
      </div>
    </div>
  );
}
