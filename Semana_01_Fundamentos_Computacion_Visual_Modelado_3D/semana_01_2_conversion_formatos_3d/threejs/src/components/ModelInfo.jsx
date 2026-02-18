export default function ModelInfo({ modelInfo, model }) {
  return (
    <div className="model-info">
      <h3>Información del Modelo</h3>

      <div className="info-section">
        <h4>{model.name}</h4>
        <p className="description">{model.description}</p>
      </div>

      {modelInfo ? (
        <div className="info-stats">
          <div className="stat">
            <span className="label">Vértices:</span>
            <span className="value">{modelInfo.vertices.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Triángulos:</span>
            <span className="value">{modelInfo.triangles.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Meshes:</span>
            <span className="value">{modelInfo.meshes}</span>
          </div>
          <div className="stat">
            <span className="label">Tamaño (X/Y/Z):</span>
            <span className="value">
              {modelInfo.size.x.toFixed(2)} / {modelInfo.size.y.toFixed(2)} / {modelInfo.size.z.toFixed(2)}
            </span>
          </div>
          <div className="stat">
            <span className="label">Formato:</span>
            <span className="value">{model.format}</span>
          </div>
        </div>
      ) : (
        <div className="info-stats">
          <p className="loading">Cargando información...</p>
        </div>
      )}

      <div className="format-comparison">
        <h4>Características del Formato</h4>
        {model.format === 'OBJ' && (
          <ul>
            <li>✓ Formato de geometría simple</li>
            <li>✓ Ampliamente soportado</li>
            <li>✗ No soporta animación</li>
            <li>✗ Texturas en archivo externo (.mtl)</li>
          </ul>
        )}
        {model.format === 'STL' && (
          <ul>
            <li>✓ Optimizado para impresión 3D</li>
            <li>✓ Formato muy simple</li>
            <li>✗ Sin colores ni materiales</li>
            <li>✗ Sin información de texturas</li>
          </ul>
        )}
        {model.format === 'GLTF' && (
          <ul>
            <li>✓ Soporta animación</li>
            <li>✓ Incluye materiales y texturas</li>
            <li>✓ Formato moderno y eficiente</li>
            <li>✓ Mejor renderizado y suavidad</li>
          </ul>
        )}
      </div>
    </div>
  );
}
