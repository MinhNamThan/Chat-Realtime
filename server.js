const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const {storeUser, getCurrentUser,getRoomUsers ,userLeave, getRoomUsersNotCur} = require('./service/users')
const formatMessage = require('./service/message')

const app = express();
const PORT = 3000;
const BotName = "Bot";

const server = http.createServer(app);
const io = socketio(server);

//Run if client connect
io.on('connection', socket => {

  // User vao phong
  socket.on('userJoinRoom', ({username, room}) => {
    socket.join(room);

    //Chao user moi
    io.to(room).emit('serverMessage', formatMessage(BotName, `Chào mừng <b>${username}</b> vào phòng <b>${room}</b>`, socket.id));
    storeUser( socket.id, username, room );

    // Gửi thông tin phòng và danh sách tất cả users trong phòng
    io.to(room).emit('roomUsers',{
      room: room,
      users: getRoomUsers(room)
    });
  })

  //nhan tin nhan tu client
  socket.on('chatMessage', (message) => {

    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('serverMessage', formatMessage(user.username, message, socket.id));
  })

  // Chạy khi mà client mất kết nối
  socket.on('disconnect', ()=>{
    const user = userLeave(socket.id);
    io.to(user.room).emit('serverMessage', formatMessage(BotName, `<b>${user.username}</b> đã rời phòng`, socket.id));

    // Gửi thông tin phòng và danh sách tất cả users trong phòng
    io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on('typing', (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('reportSever', user );
  })

});

server.listen( PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));
