const socketIO = require("socket.io");

const rooms = {};

function getClientRoom(clientId) {
  for (const room in rooms) {
    if (rooms[room].includes(clientId)) return room;
  }
  return null;
}

function removeRoom(roomId) {
  delete rooms[roomId];
}

function addClientToRoom(roomId, clientId) {
  if (!rooms[roomId]) rooms[roomId] = []; // Initialize the room if it doesn't exist
  rooms[roomId].push(clientId);
}

function removeClientFromRoom(clientId, roomId) {
  rooms[roomId] = rooms[roomId].filter((id) => id !== clientId);
  if (!rooms[roomId].length) removeRoom(roomId); // Remove the empty room to save memory
}

export function createSocketServer(httpServer) {
  const io = socketIO(httpServer);

  io.on("connection", (socket) => {
    console.log(`${socket.id} joined`);

    socket.on("join-room", (roomId) => {
      console.log(`${socket.id} joined room ${roomId}`);
      addClientToRoom(roomId, socket.id);

      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);

      socket.on('disconnect', () => {
        socket.to(roomId).emit("user-left", socket.id);
      })

      socket.on("offer", ({ offer, to }) => {
        console.log(`Sending offer from ${socket.id} to ${to}`);
        io.to(to).emit("offer", { offer, from: socket.id });
      });

      socket.on("answer", ({ answer, to }) => {
        console.log(`Answering from ${socket.id} to ${to}`);
        io.to(to).emit("answer", { answer, from: socket.id });
      });

      socket.on("candidate", (candidate) => {
        console.log(`Sending ICE candidate from ${socket.id}`);
        socket.broadcast.emit("candidate", { candidate, from: socket.id });
      });
    });
  });
}
