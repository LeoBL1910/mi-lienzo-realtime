const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const clearBtn = document.getElementById('clearBtn');

let dibujando = false;
let x = 0;
let y = 0;

const socket = io();

// Función para dibujar líneas
function dibujarLinea(linea, context) {
  context.strokeStyle = linea.color;
  context.lineWidth = linea.size;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(linea.x0, linea.y0);
  context.lineTo(linea.x1, linea.y1);
  context.stroke();
}

// Limpiar lienzo
function limpiarLienzo(context) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// --- Eventos de mouse ---
canvas.addEventListener('mousedown', e => {
  dibujando = true;
  x = e.offsetX;
  y = e.offsetY;
});
canvas.addEventListener('mouseup', () => dibujando = false);
canvas.addEventListener('mouseout', () => dibujando = false);
canvas.addEventListener('mousemove', e => {
  if (!dibujando) return;
  const linea = {
    x0: x,
    y0: y,
    x1: e.offsetX,
    y1: e.offsetY,
    color: colorPicker.value,
    size: sizePicker.value
  };
  dibujarLinea(linea, ctx);
  socket.emit('dibujar', linea);
  x = e.offsetX;
  y = e.offsetY;
});

// --- Eventos táctiles ---
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  dibujando = true;
  const rect = canvas.getBoundingClientRect();
  x = e.touches[0].clientX - rect.left;
  y = e.touches[0].clientY - rect.top;
});
canvas.addEventListener('touchend', () => dibujando = false);
canvas.addEventListener('touchcancel', () => dibujando = false);
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!dibujando) return;
  const rect = canvas.getBoundingClientRect();
  const x1 = e.touches[0].clientX - rect.left;
  const y1 = e.touches[0].clientY - rect.top;
  const linea = {
    x0: x,
    y0: y,
    x1: x1,
    y1: y1,
    color: colorPicker.value,
    size: sizePicker.value
  };
  dibujarLinea(linea, ctx);
  socket.emit('dibujar', linea);
  x = x1;
  y = y1;
});

// --- Botón limpiar ---
clearBtn.addEventListener('click', () => {
  limpiarLienzo(ctx);
  socket.emit('limpiar');
});

// --- Socket.IO ---
socket.on('dibujar', linea => dibujarLinea(linea, ctx));
socket.on('limpiar', () => limpiarLienzo(ctx));
