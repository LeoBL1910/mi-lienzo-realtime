// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static('public'));

// Tiempo real con Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Recibir dibujos de un usuario y enviar a los demás
  socket.on('dibujar', (data) => {
    socket.broadcast.emit('dibujar', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar servidor
http.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
