# Three.js + React Three Fiber - Transformaciones 3D

Un proyecto interactivo que demuestra transformaciones 3D en tiempo real usando React Three Fiber y Three.js.

## 🎯 Características

### Animaciones 3D Implementadas

1. **Traslación Circular**
   - El objeto se mueve en una trayectoria circular (3D)
   - Utiliza funciones trigonométricas: `cos()` y `sin()` en diferentes ejes
   - Velocidad: 0.5 unidades por segundo

2. **Rotación Continua**
   - Rotación en los tres ejes (X, Y, Z) simultáneamente
   - Incremento de rotación en cada frame
   - Velocidades diferentes por eje para efecto visual atractivo

3. **Escalado Sinusoidal**
   - El objeto crece y decrece suavemente
   - Usa `Math.sin(clock.elapsedTime)` para crear una onda suave
   - Escala entre 0.5 y 1.5

### Controles de Órbita

- **Ratón - Botón izquierdo + Drag**: Rotar la vista alrededor del objeto
- **Ratón - Rueda**: Zoom in/out
- **Ratón - Botón derecho + Drag**: Pan (mover la cámara)

### Iluminación

- **Luz Ambiental**: Ilumina toda la escena de manera uniforme
- **Luz Puntual Blanca**: Genera sombras realistas
- **Luz Puntual Magenta**: Efecto de luz secundaria

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de la compilación
npm run preview
```

## 🏗️ Estructura del Proyecto

```
├── src/
│   ├── components/
│   │   └── AnimatedObject.jsx    # Componente con las animaciones 3D
│   ├── App.jsx                   # Componente principal con Canvas
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Estilos globales
├── index.html                    # HTML principal
├── vite.config.js               # Configuración de Vite
├── package.json                 # Dependencias del proyecto
└── README.md                    # Este archivo
```

## 🔧 Dependencias Principales

- **React**: ^18.2.0 - Librería de UI
- **React DOM**: ^18.2.0 - Renderizado en DOM
- **Three.js**: ^r128 - Motor gráfico 3D
- **React Three Fiber**: ^8.14.0 - Binding de React para Three.js
- **@react-three/drei**: ^9.88.0 - Componentes útiles (OrbitControls, etc.)
- **Vite**: ^5.0.8 - Herramienta de construcción rápida

## 📚 Detalles Técnicos

### useFrame Hook

El hook `useFrame` de React Three Fiber se ejecuta en cada frame (normalmente 60 veces por segundo):

```jsx
useFrame(({ clock }) => {
  // clock.elapsedTime: Tiempo transcurrido en segundos
  // Se actualiza automáticamente
})
```

### Materiales Utilizados

- **meshStandardMaterial**: Renderizado físicamente correcto con propiedades de metalness y roughness

### Geometrías

- **BoxGeometry**: Cubo principal (1x1x1)
- **SphereGeometry**: Esfera interior (radio 0.3)
- **LineSegments**: Aristas del cubo para mejor visualización

## 🎨 Colores

- **Verde (#00ff88)**: Color principal del cubo
- **Magenta (#ff00ff)**: Color de la esfera interior
- **Amarillo (#ffff00)**: Color de las aristas

## 🚀 Mejoras Futuras

- Agregar más geometrías animadas
- Implementar shaders personalizados
- Agregar texturas
- Crear interfaz de controles adicionales
- Agregar sonido sincronizado con animaciones

## 📝 Notas

Este proyecto es un ejemplo educativo para demostrar:
- Transformaciones 3D en tiempo real
- Uso de React Three Fiber
- Animaciones con `useFrame`
- Controles de cámara con OrbitControls
- Iluminación en Three.js

---

**Desarrollado con ❤️ usando React, Three.js y Vite**
