const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');

let dibujando = false;
let x = 0;
let y = 0;

// Conectar al servidor Socket.IO
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

// Eventos del mouse
canvas.addEventListener('mousedown', e => {
  dibujando = true;
  x = e.offsetX;
  y = e.offsetY;
});

canvas.addEventListener('mouseup', e => {
  dibujando = false;
});

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

  dibujarLinea(linea, ctx);       // Dibuja local
  socket.emit('dibujar', linea);  // Envía al servidor

  x = e.offsetX;
  y = e.offsetY;
});

// Recibir dibujos de otros usuarios
socket.on('dibujar', (linea) => {
  dibujarLinea(linea, ctx);
});
