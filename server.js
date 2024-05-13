const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

// Generate a random alphanumeric 5-digit code for chat room ID
function generateChatId() {
  return Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Store active chat rooms
const activeRooms = {};

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join chat room
  socket.on('joinRoom', (data) => {
    const { name, roomId } = data;
    if (!activeRooms[roomId]) {
      socket.emit('error', 'Room not found');
      return;
    }
    socket.join(roomId);
    socket.name = name;
    socket.roomId = roomId;
    socket.emit('joinedRoom', { roomId });
    io.to(roomId).emit('message', `${name} joined the room`);
  });

  // Create chat room
  socket.on('createRoom', () => {
    const roomId = generateChatId();
    activeRooms[roomId] = true;
    socket.join(roomId);
    socket.roomId = roomId;
    socket.emit('createdRoom', { roomId });
  });

  // Handle chat messages
  socket.on('chatMessage', (message) => {
    io.to(socket.roomId).emit('message', `${socket.name}: ${message}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.roomId) {
      io.to(socket.roomId).emit('message', `${socket.name} left the room`);
    }
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
