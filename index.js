const express = require("express");
const app = express();
const hbs = require("hbs");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: true })); // для body

const PagesController = require("./pagesController.js");
const pages = new PagesController();

app.get("/", pages.home);

app.post("/save", pages.save);

app.get("*", (req, res) => res.redirect("/"));

const bellTimeController = require("./bellTime.js");
const bellTime = new bellTimeController();

app.listen("3000", () => {
  setInterval(() => {
    bellTime.check();
  }, 1000);
});
