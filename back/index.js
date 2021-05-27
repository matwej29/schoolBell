const express = require("express");
const app = express();
const bodyParser = require("body-parser").json();
const cors = require("cors")

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: true })); // для body

const scheduleController = require("./scheduleController.js");
const schedule = new scheduleController();

app.get("/", (req, res) => {
   res.send("Пусто")
});

app.get("/day", schedule.day);

app.get("/days", schedule.days);

app.post("/saveDay", bodyParser, schedule.saveDay);

app.get("*", (req, res) => res.redirect("/"));

app.listen("4000");
