const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser").json();
const cors = require("cors");
const io = require("socket.io")(server, {
  pingTimeout: 0,
  pingInterval: 500,
  origins: "*:*",
});

app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true })); // для body
app.use(express.static(__dirname + '/../front/build'));

const scheduleController = require("./scheduleController.js");
const schedule = new scheduleController();

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/../front/build/index.html');
});

app.get("/day", schedule.day);

app.get("/days", schedule.days);

app.post(
  "/saveDay",
  bodyParser,
  schedule.saveDay,
  () => io.local.emit(JSON.stringify(schedule.getDays())),
);

// app.get("*", (req, res) => res.redirect("/"));

server.listen(4000);
