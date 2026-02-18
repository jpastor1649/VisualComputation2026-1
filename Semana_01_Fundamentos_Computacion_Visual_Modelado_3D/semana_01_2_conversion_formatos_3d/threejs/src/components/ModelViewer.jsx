import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function ModelViewer({ modelKey, modelPath, onModelLoaded }) {
  const { scene } = useThree();
  const modelRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Limpiar modelo anterior
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = null;
    }

    const loadModel = async () => {
      try {
        let model;
        let geometry;
        const material = new THREE.MeshPhongMaterial({
          color: 0x888888,
          shininess: 100,
          side: THREE.DoubleSide
        });

        if (modelKey === 'obj') {
          const loader = new OBJLoader();
          model = await new Promise((resolve, reject) => {
            loader.load(
              modelPath,
              resolve,
              undefined,
              reject
            );
          });

          // Aplicar material a todos los meshes
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = material;
              geometry = child.geometry;
            }
          });
        } else if (modelKey === 'stl') {
          const loader = new STLLoader();
          geometry = await new Promise((resolve, reject) => {
            loader.load(
              modelPath,
              resolve,
              undefined,
              reject
            );
          });

          model = new THREE.Mesh(geometry, material);
        } else if (modelKey === 'gltf') {
          const loader = new GLTFLoader();
          const gltf = await new Promise((resolve, reject) => {
            loader.load(
              modelPath,
              resolve,
              undefined,
              reject
            );
          });

          model = gltf.scene;

          // Aplicar material a todos los meshes del GLTF si es necesario
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // Mantener los materiales originales del GLTF si existen
              if (!child.material) {
                child.material = material;
              }
            }
          });
        }

        // Centrar y escalar el modelo
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 50 / maxDim;

        model.position.sub(center);
        model.scale.multiplyScalar(scale);

        // Agregar el modelo a la escena
        scene.add(model);
        modelRef.current = model;

        // Calcular information del modelo
        let vertexCount = 0;
        let triangleCount = 0;
        let meshCount = 0;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshCount++;
            const g = child.geometry;
            if (g.isBufferGeometry) {
              if (g.attributes.position) {
                vertexCount += g.attributes.position.count;
              }
              if (g.index) {
                triangleCount += g.index.count / 3;
              } else if (g.attributes.position) {
                triangleCount += g.attributes.position.count / 3;
              }
            }
          }
        });

        onModelLoaded({
          vertices: vertexCount,
          triangles: Math.round(triangleCount),
          meshes: meshCount,
          size: {
            x: Math.round(size.x * scale * 100) / 100,
            y: Math.round(size.y * scale * 100) / 100,
            z: Math.round(size.z * scale * 100) / 100
          }
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading model:', err);
        setError(err.message);
        setLoading(false);
        onModelLoaded(null);
      }
    };

    loadModel();
  }, [modelKey, modelPath, scene, onModelLoaded]);

  return (
    <>
      <OrbitControls />
    </>
  );
}
