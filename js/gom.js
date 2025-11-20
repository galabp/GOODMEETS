let figuraSeleccionadaTipo = 1; 
let figuras = [];
let figuraActiva = null; 
let cnv; 
let btnGuardar;

let mostrarUI = true;       // Mostrar textos y botón
let mostrarSeleccion = true; // Mostrar borde de figura activa
let mostrarGOODMEETS = false; // Mostrar palabra GOODMEETS

function setup() {
  cnv = createCanvas(windowWidth, windowHeight); 
  textSize(16);

  btnGuardar = createButton('Guardar PNG');
  btnGuardar.position(20, 20);
  btnGuardar.mousePressed(guardarPNG);
  btnGuardar.style('padding',  '8px 12px');
}

function draw() {
  background(240);

  // --- UI normal ---
  if (mostrarUI) {
    fill(0);
    textAlign(CENTER, TOP); 
    text(
      "1: Cuadrado | 2: Círculo | 3: Rectángulo | 4: Triángulo | 0: Deshacer | S: Guardar PNG",
      width / 2,
      20
    );
  }

  // --- Dibujar figuras ---
  for (let f of figuras) dibujarFigura(f);

  // --- Borde de figura activa (solo si UI visible) ---
  if (mostrarSeleccion && figuraActiva && mostrarUI) {
    push();
    noFill();
    stroke(0);
    strokeWeight(3);
    rectMode(CENTER);
    translate(figuraActiva.x, figuraActiva.y);
    rotate(figuraActiva.angulo || 0);

    if (figuraActiva.tipo === 1 || figuraActiva.tipo === 3) {
      let w = figuraActiva.tipo === 1 ? 100 : 140;
      let h = figuraActiva.tipo === 1 ? 100 : 80;
      rect(0, 0, w, h);
    } else if (figuraActiva.tipo === 2) ellipse(0, 0, 100);
    else if (figuraActiva.tipo === 4) triangle(-50, 40, 0, -60, 50, 40);

    pop();
  }

  // --- GOODMEETS durante la captura ---
  if (mostrarGOODMEETS) {
    textAlign(CENTER, CENTER);
    textSize(10);
    fill(0);
    text("GOODMEETS", width / 2, height - 60);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === '1') figuraSeleccionadaTipo = 1;
  if (key === '2') figuraSeleccionadaTipo = 2;
  if (key === '3') figuraSeleccionadaTipo = 3;
  if (key === '4') figuraSeleccionadaTipo = 4;

  if (key === '0') {
    figuras.pop();
    figuraActiva = null;
  }

  if (key === 's' || key === 'S') guardarPNG();

  if (figuraActiva) {
    if (keyCode === LEFT_ARROW) figuraActiva.angulo -= PI / 12;
    if (keyCode === RIGHT_ARROW) figuraActiva.angulo += PI / 12;
  }
}

function mousePressed() {
  figuraActiva = null;

  for (let i = figuras.length - 1; i >= 0; i--) {
    if (estaDentro(figuras[i], mouseX, mouseY)) {
      figuraActiva = figuras[i];
      return;
    }
  }

  figuras.push({
    tipo: figuraSeleccionadaTipo,
    x: mouseX,
    y: mouseY,
    angulo: 0
  });
}

function dibujarFigura(f) {
  push();
  translate(f.x, f.y);
  rotate(f.angulo || 0);
  noStroke();

  if (f.tipo === 1) {
    fill(255, 0, 0);
    square(-50, -50, 100);
  } else if (f.tipo === 2) {
    fill(0, 120, 255);
    circle(0, 0, 100);
  } else if (f.tipo === 3) {
    fill(0, 200, 0);
    rect(-70, -40, 140, 80);
  } else if (f.tipo === 4) {
    fill(255, 200, 0);
    triangle(0, -60, -50, 40, 50, 40);
  }

  pop();
}

function estaDentro(f, px, py) {
  let dx = px - f.x;
  let dy = py - f.y;
  let ang = f.angulo || 0;
  let x = dx * cos(-ang) - dy * sin(-ang);
  let y = dx * sin(-ang) + dy * cos(-ang);

  if (f.tipo === 1) return abs(x) <= 50 && abs(y) <= 50;
  if (f.tipo === 2) return x * x + y * y <= 2500;
  if (f.tipo === 3) return abs(x) <= 70 && abs(y) <= 40;
  if (f.tipo === 4) return x >= -50 && x <= 50 && y >= -60 && y <= 40;

  return false;
}

// ---- GUARDADO CON GOODMEETS ----
function guardarPNG() {

  // Ocultar UI + selección
  mostrarUI = false;
  mostrarSeleccion = false;
  btnGuardar.hide();

  // Mostrar GOODMEETS
  mostrarGOODMEETS = true;

  // Esperar a que se dibuje el nuevo estado
  setTimeout(() => {

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = 'diseno-' + timestamp + '.png';

    try {
      saveCanvas(cnv, filename);
    } catch (e) {
      saveCanvas(filename);
    }

    // Restaurar estado original
    mostrarGOODMEETS = false;
    mostrarUI = true;
    mostrarSeleccion = true;
    btnGuardar.show();

  }, 100);
}
