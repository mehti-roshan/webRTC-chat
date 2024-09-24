const express = require("express");
const http = require("http");
const { randomUUID } = require("crypto");
const { createSocketServer } = require("./socketServer");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

server.listen(3000);

app.get("/", (req, res) => {
  const room = randomUUID();
  res.redirect(`/${room}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

const server = http.createServer(app);
createSocketServer(server);