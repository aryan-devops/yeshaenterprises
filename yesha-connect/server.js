const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("YESHA Connect Socket.io Server\n");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send-message", (msg) => {
    console.log(`Broadcasting message in room ${msg.room_id}:`, msg.content);
    socket.to(msg.room_id).emit("message", msg);
  });

  socket.on("delete-message", (msg) => {
    console.log(`Broadcasting delete message in room ${msg.room_id}:`, msg.id);
    socket.to(msg.room_id).emit("delete-message", msg.id);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
