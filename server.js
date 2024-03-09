import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const userSocketIdMap = {};

const getConnectedUsers = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        name: userSocketIdMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("someone connected!", socket.id);

  socket.on("join", ({ roomId, name }) => {
    userSocketIdMap[socket.id] = name;
    socket.join(roomId);
    const users = getConnectedUsers(roomId);
    console.log(users);
    users.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        users,
        name,
        socketId:socket.id
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((room) => {
      io.to(room).emit("disconnected", {
        socketId: socket.id,
        name: userSocketIdMap[socket.id],
      });
    });
    delete userSocketIdMap[socket.id];
    socket.leave();
  });


  socket.on('code-change',({roomId,code})=>{
    socket.in(roomId).emit('code-change', {code});
  })


  socket.on('sync-code',({socketId,code})=>{
    io.to(socketId).emit('code-change', {code});
  })


});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
