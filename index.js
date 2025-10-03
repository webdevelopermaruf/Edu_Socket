const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || '*', // replace with your Nuxt URL in prod
    methods: ['GET', 'POST','WS']
  }
});

// WebSocket connections
io.on('connection', (socket) => {
  // Join room if specified
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    // disconnect
  });
});

// Simple REST API so Laravel can POST data here
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to websocket!')
})
app.post('/broadcast', (req, res) => {
  const { event, data, room } = req.body;

  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }

  return res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
});
