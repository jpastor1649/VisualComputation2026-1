import React from 'react'
import styles from './ControlPanel.module.css'

export function ControlPanel({ cameraParams, setCameraParams, distortionParams, setDistortionParams, showFrustum, setShowFrustum, projections }) {
  const handleCameraChange = (e) => {
    const { name, value } = e.target
    setCameraParams(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }))
  }
  
  const handleDistortionChange = (e) => {
    const { name, value } = e.target
    setDistortionParams(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }))
  }
  
  const resetCamera = () => {
    setCameraParams({
      fov: 75,
      near: 0.1,
      far: 100,
      posX: 0,
      posY: 0,
      posZ: 5
    })
  }
  
  const resetDistortion = () => {
    setDistortionParams({
      k1: 0,
      k2: 0
    })
  }
  
  return (
    <div className={styles.panel}>
      <div className={styles.container}>
        <h1 className={styles.title}>📷 Pinhole Camera Calibration</h1>
        
        {/* Camera Parameters */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Camera Parameters</h2>
          
          <div className={styles.group}>
            <label>FOV (Field of View)</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                name="fov"
                min="10"
                max="160"
                step="1"
                value={cameraParams.fov}
                onChange={handleCameraChange}
                className={styles.slider}
              />
              <span className={styles.value}>{cameraParams.fov.toFixed(1)}°</span>
            </div>
          </div>
          
          <div className={styles.group}>
            <label>Near Plane</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                name="near"
                min="0.01"
                max="1"
                step="0.01"
                value={cameraParams.near}
                onChange={handleCameraChange}
                className={styles.slider}
              />
              <span className={styles.value}>{cameraParams.near.toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.group}>
            <label>Far Plane</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                name="far"
                min="10"
                max="500"
                step="1"
                value={cameraParams.far}
                onChange={handleCameraChange}
                className={styles.slider}
              />
              <span className={styles.value}>{cameraParams.far.toFixed(0)}</span>
            </div>
          </div>
          
          <div className={styles.positionGroup}>
            <label>Camera Position</label>
            <div className={styles.inputGroup}>
              <div>
                <label className={styles.smallLabel}>X</label>
                <input
                  type="number"
                  name="posX"
                  step="0.1"
                  value={cameraParams.posX}
                  onChange={handleCameraChange}
                  className={styles.numberInput}
                />
              </div>
              <div>
                <label className={styles.smallLabel}>Y</label>
                <input
                  type="number"
                  name="posY"
                  step="0.1"
                  value={cameraParams.posY}
                  onChange={handleCameraChange}
                  className={styles.numberInput}
                />
              </div>
              <div>
                <label className={styles.smallLabel}>Z</label>
                <input
                  type="number"
                  name="posZ"
                  step="0.1"
                  value={cameraParams.posZ}
                  onChange={handleCameraChange}
                  className={styles.numberInput}
                />
              </div>
            </div>
          </div>
          
          <button onClick={resetCamera} className={styles.resetBtn}>
            Reset Camera
          </button>
        </div>
        
        {/* Distortion Parameters */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Lens Distortion</h2>
          
          <div className={styles.group}>
            <label>Radial Distortion K1</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                name="k1"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={distortionParams.k1}
                onChange={handleDistortionChange}
                className={styles.slider}
              />
              <span className={styles.value}>{distortionParams.k1.toFixed(3)}</span>
            </div>
          </div>
          
          <div className={styles.group}>
            <label>Radial Distortion K2</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                name="k2"
                min="-0.5"
                max="0.5"
                step="0.01"
                value={distortionParams.k2}
                onChange={handleDistortionChange}
                className={styles.slider}
              />
              <span className={styles.value}>{distortionParams.k2.toFixed(3)}</span>
            </div>
          </div>
          
          <button onClick={resetDistortion} className={styles.resetBtn}>
            Reset Distortion
          </button>
        </div>
        
        {/* Visualization Options */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Visualization</h2>
          
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="showFrustum"
              checked={showFrustum}
              onChange={(e) => setShowFrustum(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="showFrustum" className={styles.checkboxLabel}>
              Show Camera Frustum
            </label>
          </div>
        </div>
        
        {/* Projections Info */}
        {projections && projections.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3D to 2D Projections</h2>
            <div className={styles.projectionsList}>
              {projections.map((proj, idx) => (
                <div key={idx} className={styles.projectionItem}>
                  <div className={styles.projectionLabel}>Point {idx}</div>
                  <div className={styles.projectionCoords}>
                    <div>World: ({proj.worldPos.x.toFixed(1)}, {proj.worldPos.y.toFixed(1)}, {proj.worldPos.z.toFixed(1)})</div>
                    <div>Screen: ({proj.original.x.toFixed(0)}, {proj.original.y.toFixed(0)})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
