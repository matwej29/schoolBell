const express = require("express");
const app = express();
const hbs = require("hbs");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: true })); // для body

const SettingController = require("./settingsController.js");
const settingController = new SettingController();

app.get("/", (req, res) => {
  const setting = settingController.Read();
  const times = setting.firstLesson.split(" ");
  const bDuration = setting.brakeDuration;
  res.render("layout", {
    StartH: {
      action: "/save",
      value: times[0],
      inputName: "LSH",
    },
    StartM: {
      action: "/save",
      value: times[1],
      inputName: "LSM",
    },
    EndH: {
      action: "/save",
      value: times[2],
      inputName: "LEH",
    },
    EndM: {
      action: "/save",
      value: times[3],
      inputName: "LEM",
    },
    BrakeDuration: {
      action: "/save",
      value: bDuration,
      inputName: "bDuration",
    },
  });
});

app.post("/save", (req, res) => {
  const settings = {
    enabled: req.body.enable,
    firstLesson: [req.body.LSH, req.body.LSM, req.body.LEH, req.body.LEM].join(
      " "
    ),
    brakeDuration: req.body.bDuration,
  };
  settingController.Write(settings);
  res.redirect("/");
});

app.listen("3000", () => {
  setInterval(() => {
    //
  }, 1000);
});
