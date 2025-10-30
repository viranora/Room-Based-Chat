const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 5001;

io.on('connection', (socket) => {
  console.log(`Kullanıcı bağlandı: ${socket.id}`);

  socket.on('join_room', ({ roomId, username }) => {
    socket.join(roomId);
    
    socket.data.username = username;
    socket.data.roomId = roomId;

    console.log(`Kullanıcı ${username} (${socket.id}), ${roomId} odasına katıldı.`);
  });

  socket.on('send_message', (data) => {

    const messageWithTimestamp = {
      ...data,
      timestamp: new Date()
    };
    

    io.to(data.roomId).emit('receive_message', messageWithTimestamp);
    
    console.log(`${data.roomId} odasına ${data.username}'dan mesaj: ${data.text}`);
  });


  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`Kullanıcı ${socket.id}, ${roomId} odasından ayrıldı.`);
  });

 
  socket.on('typing_start', ({ roomId }) => {

    socket.to(roomId).emit('user_typing', {
      username: socket.data.username,
      id: socket.id
    });
  });


  socket.on('typing_stop', ({ roomId }) => {

    socket.to(roomId).emit('user_stops_typing', socket.id);
  });
  
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı', socket.id);
    
    const roomId = socket.data.roomId;
    if (roomId) {
      socket.to(roomId).emit('user_stops_typing', socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO Sunucusu ${PORT} portunda çalışıyor`);
});