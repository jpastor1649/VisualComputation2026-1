float angle = 0;

void setup() {
  size(800, 600, P3D); // Activamos el motor 3D
  smooth(8);           // Suavizado de bordes
}

void draw() {
  background(20);      // Fondo gris oscuro
  
  // Luces para que el cubo tenga volumen
  lights();
  directionalLight(255, 255, 255, 0, 1, -1);
  
  // 1. Centrar la cámara en la ventana
  translate(width/2, height/2, 0);
  
  // --- INICIO DE TRANSFORMACIONES ---
  pushMatrix(); 
    
    // 2. Traslación ondulada (usando frameCount y sin/cos)
    float tx = sin(frameCount * 0.05) * 200;
    float ty = cos(frameCount * 0.03) * 100;
    translate(tx, ty, 0);
    
    // 3. Rotación en múltiples ejes
    rotateX(angle);
    rotateY(angle * 0.5);
    rotateZ(angle * 0.2);
    
    // 4. Escala cíclica (respira entre 0.5x y 2.0x)
    float s = 1.0 + sin(frameCount * 0.2) * 0.5;
    scale(s);
    
    // 5. Dibujar el Cubo
    stroke(255);        // Bordes blancos
    fill(100, 150, 255); // Relleno azul
    box(100);           // Cubo de 100px de lado
    
  popMatrix();
  // --- FIN DE TRANSFORMACIONES ---

  // Incrementar ángulo para el siguiente frame
  angle += 0.02;
}
