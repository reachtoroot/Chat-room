const socket = io();

function joinRoom() {
  const name = document.getElementById('nameInput').value;
  const roomId = document.getElementById('roomIdInput').value;
  socket.emit('joinRoom', { name, roomId });
  document.getElementById('joinRoom').style.display = 'none';
  document.getElementById('chatRoom').style.display = 'block';
}

function createRoom() {
  socket.emit('createRoom');
}

function sendMessage() {
  const message = document.getElementById('messageInput').value;
  socket.emit('chatMessage', message);
  document.getElementById('messageInput').value = '';
}

socket.on('message', (message) => {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `<p>${message}</p>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('joinedRoom', (data) => {
  console.log(`Joined room ${data.roomId}`);
});

socket.on('createdRoom', (data) => {
  document.getElementById('roomIdDisplay').innerText = `Room ID: ${data.roomId}`;
});

socket.on('error', (errorMessage) => {
  alert(errorMessage);
});
