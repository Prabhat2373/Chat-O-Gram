const express = require("express");
const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users = {};

app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.send("/index.html");
});

io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("new-user-joined", (name) => {
    console.log(`new user : ${name}`);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);

    socket.on("typing", (data) => {
      if (data.typing === true) {
        io.emit("show", data);
      } else io.emit("show", data);
    });
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("typing");
    socket.broadcast.emit("receive", {
      name: users[socket.id],
      message: message,
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
