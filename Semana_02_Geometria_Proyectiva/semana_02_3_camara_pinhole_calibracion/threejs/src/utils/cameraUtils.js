import * as THREE from 'three'

/**
 * Convierte coordenadas 3D a 2D de pantalla usando matriz de proyección
 * @param {THREE.Vector3} position - Posición 3D
 * @param {THREE.Camera} camera - Cámara Three.js
 * @param {number} width - Ancho de pantalla
 * @param {number} height - Alto de pantalla
 * @returns {THREE.Vector2} Coordenadas 2D normalizadas
 */
export function project3DTo2D(position, camera, width, height) {
  const vector = position.clone()
  const canvas = new THREE.Vector4()
  
  vector.project(camera)
  
  const widthHalf = width / 2
  const heightHalf = height / 2
  
  vector.x = vector.x * widthHalf + widthHalf
  vector.y = -vector.y * heightHalf + heightHalf
  
  return new THREE.Vector2(vector.x, vector.y)
}

/**
 * Simula distorsión radial de lente
 * @param {THREE.Vector2} point - Punto en coordenadas normalizadas [-1, 1]
 * @param {number} k1 - Coeficiente de distorsión radial
 * @param {number} k2 - Segundo coeficiente de distorsión radial
 * @returns {THREE.Vector2} Punto distorsionado
 */
export function applyRadialDistortion(point, k1, k2) {
  const x = point.x
  const y = point.y
  const r2 = x * x + y * y
  
  const distortion = 1 + k1 * r2 + k2 * r2 * r2
  
  return new THREE.Vector2(x * distortion, y * distortion)
}

/**
 * Calcula los puntos del frustum de cámara
 * @param {THREE.Camera} camera - Cámara
 * @returns {THREE.Vector3[]} Array de 8 puntos del frustum
 */
export function getFrustumPoints(camera) {
  const fov = (camera.fov * Math.PI) / 180 // Convertir a radianes
  const height = 2 * Math.tan(fov / 2) * camera.far
  const width = height * camera.aspect
  
  const depth = camera.far
  const nearHeight = 2 * Math.tan(fov / 2) * camera.near
  const nearWidth = nearHeight * camera.aspect
  
  // Puntos del frustum en coordenadas locales
  const corners = [
    // Near plane
    new THREE.Vector3(-nearWidth / 2, nearHeight / 2, -camera.near),
    new THREE.Vector3(nearWidth / 2, nearHeight / 2, -camera.near),
    new THREE.Vector3(nearWidth / 2, -nearHeight / 2, -camera.near),
    new THREE.Vector3(-nearWidth / 2, -nearHeight / 2, -camera.near),
    // Far plane
    new THREE.Vector3(-width / 2, height / 2, -camera.far),
    new THREE.Vector3(width / 2, height / 2, -camera.far),
    new THREE.Vector3(width / 2, -height / 2, -camera.far),
    new THREE.Vector3(-width / 2, -height / 2, -camera.far),
  ]
  
  // Aplicar transformación de cámara
  const matrix = new THREE.Matrix4()
  matrix.makeRotationFromQuaternion(camera.quaternion)
  matrix.setPosition(camera.position)
  
  return corners.map(corner => corner.applyMatrix4(matrix))
}

/**
 * Crea geometría de líneas del frustum
 * @param {THREE.Vector3[]} corners - Puntos del frustum
 * @returns {THREE.BufferGeometry} Geometría con líneas
 */
export function createFrustumGeometry(corners) {
  const positions = []
  
  // Near plane
  positions.push(...corners[0].toArray(), ...corners[1].toArray())
  positions.push(...corners[1].toArray(), ...corners[2].toArray())
  positions.push(...corners[2].toArray(), ...corners[3].toArray())
  positions.push(...corners[3].toArray(), ...corners[0].toArray())
  
  // Far plane
  positions.push(...corners[4].toArray(), ...corners[5].toArray())
  positions.push(...corners[5].toArray(), ...corners[6].toArray())
  positions.push(...corners[6].toArray(), ...corners[7].toArray())
  positions.push(...corners[7].toArray(), ...corners[4].toArray())
  
  // Conexiones
  positions.push(...corners[0].toArray(), ...corners[4].toArray())
  positions.push(...corners[1].toArray(), ...corners[5].toArray())
  positions.push(...corners[2].toArray(), ...corners[6].toArray())
  positions.push(...corners[3].toArray(), ...corners[7].toArray())
  
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  
  return geometry
}
